"use strict";

import {NextApiRequest, NextApiResponse} from 'next';
import {db} from "../../../../db.js";

export default async function getDocumentById(req: NextApiRequest, res: NextApiResponse) {
    const id = [req.query.document_id];
    const document = await db("documents").where("document_id", id.toString()); //[req.query.id] doesnt't work. Hence 1 for now.
    res.json(document);
}