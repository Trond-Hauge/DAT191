"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../db.js";

export default async function getDocumentById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = [req.query.document_id];
        const document = await db("documents").where("document_id", id.toString()).first();
        res.json(document);
    }

    // Use to update entire document, for example replace with new file
    if (req.method === "PUT") { 
        
    }

    // Use to partially update document, like renaming it.
    if (req.method === "PATCH") {
        const body = JSON.parse(req.body);
        const newName = body.newName;
        const document_id = req.query.document_id;

        if (newName && document_id) {
            const count = await db("documents").where({document_id}).update({document_name: newName});
            if (count === 0) console.log("NO UPDATE");
        }

        res.send({}); // Just need to resolve
    }
}