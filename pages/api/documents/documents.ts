import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../../../db.js";
import { verify } from "jsonwebtoken";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        let email = "";
        verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
            if (!err && decoded) {
                if (decoded.memberEmail) email = decoded.memberEmail;
            }
        });

        const member = await db("members").where("email",email).first();
        if (member) {
            if (member.admin) {
                const documents = await db.select("*").from("documents")
                .leftJoin("members", "documents.owner", "members.member_id")
                .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
                .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id");
                res.json(documents);
            } else {
                const documents = await db.select("*").from("documents")
                .leftJoin("members", "documents.owner", "members.member_id")
                .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
                .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id")
                .where("shared", true).orWhere("owner", member.member_id);
                res.json(documents);
            }
        } else {
            res.status(401).send({ error: "Not authenticated" });
        }
    } else {
        res.status(405).send({ error: "Method not allowed" });
    }
}