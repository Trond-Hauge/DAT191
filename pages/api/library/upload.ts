"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { gc } from "../../../gc";
import { verify } from "jsonwebtoken";
import { maxFileSizeBytes } from "../../../app.config.js";
import formidable from "formidable";
import fs from "fs";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED } from "../../../messages/apiResponse.js";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        let email = "";
        verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
            if (!err && decoded?.memberEmail) email = decoded.memberEmail;
        });

        const member = await db("members").where("email",email).first();
        if (!member || member.permission === "unverified") {
            res.status(401).send( { error: "User is not authenticated/verified" });
        }
        else {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err || !files.file) {
                    // Handle error while parsing file.
                    res.status(400).send(BAD_REQUEST);
                }
                else {
                    // Get relevant information from form.
                    const name = fields.fileName;
                    const filename = `${name}.pdf`;
                    const desc = fields.fileDesc;
                    const _public = fields.public;
                    const fileObject = files.file;
                    const size = fileObject.size;

                    // Check if file size exceeds limit.
                    if (size > maxFileSizeBytes) {
                        res.status(207).json({ message: `File is too large. File size limit is ${maxFileSizeBytes / 1024 / 1024}MB` })
                        return;
                    }

                    // Read the file into memory.
                    fs.readFile(fileObject.filepath, async (err, data) => {
                        if (err) {
                            res.status(500).json(INTERNAL_SERVER_ERROR);
                        }
                        else {
                            try {
                                // Save file to google storage and insert document information into database.
                                await gc.file(`${name}.pdf`).save(data);

                                await db("documents").insert({
                                    document_name: name,
                                    document_description: desc,
                                    public: _public,
                                    filename,
                                    owner: member.member_id
                                });

                                // Succesful repsonse.
                                res.status(201).json( {message: "File was uploaded successfully"} );
                            }
                            catch (err) {
                                // Handle error.
                                console.error(err);
                                res.status(500).json(INTERNAL_SERVER_ERROR);
                            }
                        }
                    });
                }
            });
        }
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}