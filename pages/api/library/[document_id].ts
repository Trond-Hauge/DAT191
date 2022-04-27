"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../db";
import { getMemberClaims } from '../../../utils/server/user';

export default async function getDocumentById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const docID = parseInt(req.query.document_id as string);
        const cookie = req.headers.cookie;
        if (!docID) {
            res.status(500).json({ error: "No document id found" })
            return;
        }

        const { id, permission } = getMemberClaims(cookie);

        const doc = await db.select("documents.document_name", "documents.document_id", "documents.owner", "documents.document_description", "documents.filename", "documents.public","members.first_name", "members.last_name", "organisations.organisation_name")
            .from("documents")
            .where("documents.document_id", docID)
            .leftJoin("members", "documents.owner", "members.member_id")
            .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
            .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id")
            .first();

        if (!doc?.public && permission !== "admin" && doc?.owner !== id) {
            res.status(403).json({ error: "User is not authorised to view content" });
            return;
        }
        else {
            res.status(200).json({ doc })
        }
    }
    else {
        res.status(405).send({ error: "Method not allowed" });
    }
}