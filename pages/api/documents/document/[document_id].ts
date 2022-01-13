"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../../db.js";

export default async function getDocumentById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = [req.query.document_id];
        const document = await db("documents").where("document_id", id.toString());
        res.json(document);
    }

    // Do something else, like updating
    if (req.method === "PUT") { 
        
    } 
}