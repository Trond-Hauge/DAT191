"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../db.js";

export default async function getDocumentById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = req.query.document_id;
        const doc = await db("documents").where("document_id", id).first();
        res.status(200).send(doc.file);
    }
    else {
        res.status(405).send({ message: "Method not allowed" });
    }
}