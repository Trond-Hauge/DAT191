"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";
import formidable from "formidable";
import fs from "fs";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        // TODO - Authenticate user before allowing upload, and get user's name and organisation
        //        to be saved as a document with the file data.
        
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err || !files.file) {
                // Handle error while parsing file.
                res.status(500).send( {message: "Error occured while parsing form"} );
            }

            // Get relevant information from form
            const desc = fields.fileDesc;
            const fileObject = files.file;

            fs.readFile(fileObject.filepath, (err, data) => {
                if (err) {
                    // Handle error when reading file.
                    res.status(500).send( {message: "Error occured while reading file"} )
                }
                else {
                    db("documents").insert({
                        document_name: "UPLOAD TEST",
                        document_description: desc,
                        shared: true,
                        owner: 3,
                        file: data,
                    }).then( () => {
                        // Successful upload.
                        res.status(201).send( {message: "File was uploaded successfully"} );
                    }).catch( err => {
                        // Failed to upload.
                        res.status(500).send( {message: "File was not uploaded successfully"} );
                    })
                }
            });
        });
    }
    else {
        res.status(405).send({ error: "Method not allowed" });
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}