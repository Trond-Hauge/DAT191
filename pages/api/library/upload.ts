"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";
import formidable from "formidable";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err || !files.file) {
                // Handle error
                console.log("ERROR WITH FORM PARSING");
            }

            const desc = fields.fileDesc;
            const file = files.file;

            await db("documents").insert({
                document_name: "NAME",
                document_description: desc,
                shared: true,
                owner: 3,
                file: file,
            });

            const fs = await db("documents").where("owner", 3);
            console.log(fs);
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