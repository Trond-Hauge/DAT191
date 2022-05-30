"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { gc } from "../../../gc";
import { maxFileSize } from "../../../app.config.js";
import formidable from "formidable";
import fs from "fs";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED } from "../../../messages/apiResponse.js";
import { getMemberClaims } from "../../../utils/server/user";

const B_TO_MB = 0.00000095367432;

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { id, permission } = getMemberClaims(req.cookies.auth);

        if (permission !== "verified" && permission !== "admin") {
            res.status(401).send( { error: "User is not authenticated/verified" });
            return;
        }

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err || !files.file) {
                // Handle error while parsing file.
                res.status(400).send(BAD_REQUEST);
            }
            else {
                // Get relevant information from form.
                const name = fields.name;
                const desc = fields.desc;
                const _public = fields.public;
                const file = files.file;
                const size = file.size;
                const filename = file.originalFilename;
                const fileref = `${id}/${Date.now().valueOf()}:${filename}`;

                // Check if file size exceeds limit.
                if (size * B_TO_MB > maxFileSize) {
                    res.status(207).json({ message: `File is too large. File size limit is ${maxFileSize}MB` })
                    return;
                }

                // Read the file into memory.
                fs.readFile(file.filepath, async (err, data) => {
                    if (err) {
                        res.status(500).json(INTERNAL_SERVER_ERROR);
                        return;
                    }

                    try {
                        // Save file to google storage and insert document information into database.
                        await gc.file(fileref).save(data);

                        // Insert document information to database
                        await db("documents").insert({
                            document_name: name,
                            document_description: desc,
                            public: _public,
                            filename,
                            fileref,
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
                });
            }
        });
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