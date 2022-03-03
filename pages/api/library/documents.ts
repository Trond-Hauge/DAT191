"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        let email = "";
        verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
            if (!err && decoded?.memberEmail) email = decoded.memberEmail;
        });

        const member = await db("members").where("email",email).first();
        if (!member || member.permission === "unverified") {
            const documents = await db.select("documents.document_name", "documents.document_description", "documents.document_id", "members.first_name", "members.last_name", "organisations.organisation_name")
            .from("documents")
            .leftJoin("members", "documents.owner", "members.member_id")
            .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
            .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id")
            .where("public", true);
            res.json(documents);
        }
        else if (member.permission === "admin") {
            const documents = await db.select("documents.document_name", "documents.document_description", "documents.document_id", "members.first_name", "members.last_name", "organisations.organisation_name")
            .from("documents")
            .leftJoin("members", "documents.owner", "members.member_id")
            .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
            .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id");
            res.json(documents);
        }
        else {
            const documents = await db.select("documents.document_name", "documents.document_description", "documents.document_id", "members.first_name", "members.last_name", "organisations.organisation_name")
            .from("documents")
            .leftJoin("members", "documents.owner", "members.member_id")
            .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
            .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id")
            .where("public", true).orWhere("owner", member.member_id);
            res.json(documents);
        }
    }
    else {
        res.status(405).send({ error: "Method not allowed" });
    }
}