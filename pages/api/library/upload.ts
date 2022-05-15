"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { maxFileSizeBytes } from "../../../app.config.js";
import formidable from "formidable";
import fs from "fs";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse.js";
import { uploadFile } from "../../../firebase";
import { getMemberClaims } from "../../../utils/server/user";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { id, permission } = getMemberClaims(req.cookies.auth);

        if (permission === "unverified") {
            res.status(401).json(NOT_AUTHORISED);
        }
        else {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err || !files.file) {
                    // Handle error while parsing file.
                    res.status(400).json(BAD_REQUEST);
                }
                else {
                    // Get relevant information from form.
                    const name = fields.name;
                    const desc = fields.desc;
                    const _public = fields.public;
                    const file = files.file;
                    const size = file.size;
                    const filename = file.originalFilename;
                    const fileRef = `${id}/${Date.now().valueOf()}:${filename}`;

                    // Check if file size exceeds limit.
                    if (size > maxFileSizeBytes) {
                        res.status(207).json({ message: `File is too large. File size limit is ${maxFileSizeBytes / 1024 / 1024}MB` })
                        return;
                    }

                    // Read the file into memory.
                    fs.readFile(file.filepath, async (err, data) => {
                        if (err) {
                            res.status(500).json(INTERNAL_SERVER_ERROR);
                        }
                        else {
                            try {
                                // Save file to storage and insert document information into database.
                                await uploadFile(fileRef, data);

                                await db("documents").insert({
                                    document_name: name,
                                    document_description: desc,
                                    public: _public,
                                    filename,
                                    fileref: fileRef,
                                    owner: id
                                });

                                // Succesful response.
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