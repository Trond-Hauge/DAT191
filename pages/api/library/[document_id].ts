"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";
import { readFileSync } from 'fs';

export default async function getDocumentById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const doc_id = req.query.document_id;

        let email = "";
        verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
            if (!err && decoded?.memberEmail) email = decoded.memberEmail;
        });
        const member = await db("members").where("email",email).first();

        const doc = await db.select("documents.document_name", "documents.document_description", "documents.filepath", "documents.shared", "documents.filepath","members.first_name", "members.last_name", "organisations.organisation_name")
        .from("documents")
        .where("documents.document_id", doc_id)
        .leftJoin("members", "documents.owner", "members.member_id")
        .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
        .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id")
        .first();

        if (!doc.shared && (!member || member.permission !== "admin" || member.member_id !== doc.owner)) {
            res.status(403).json({ error: "User is not authorised to view content" });
        }
        else {
            const file = readFileSync(doc.filepath);
            res.status(200).json({ doc, file });
        }
    }
    else {
        res.status(405).send({ error: "Method not allowed" });
    }
}