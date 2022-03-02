"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";

export default async function getDocumentById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = req.query.document_id;
        const isMetaDataRequest = req.query.isMetaDataRequest;

        let email = "";
        verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
            if (!err && decoded?.memberEmail) email = decoded.memberEmail;
        });
        const member = await db("members").where("email",email).first();

        if (isMetaDataRequest) {
            const docInfo = await db.select("documents.document_name", "documents.shared", "members.first_name", "members.last_name", "organisations.organisation_name")
            .from("documents")
            .leftJoin("members", "documents.owner", "members.member_id")
            .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
            .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id")
            .first();

            if (!docInfo.shared && (!member || member.permission !== "admin" || member.member_id !== docInfo.owner)) {
                res.status(403).json({ message: "User is not authorised to view content" });
            }
            else {
                res.status(200).json(docInfo);
            }
        }
        else {
            const doc = await db.select("file").from("documents").where("document_id", id).first();
            res.status(200).send(doc.file);
        }
    }
    else {
        res.status(405).send({ message: "Method not allowed" });
    }
}