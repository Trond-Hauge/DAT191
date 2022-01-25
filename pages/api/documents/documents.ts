import {NextApiRequest, NextApiResponse, NextApiHandler} from "next";
import {db} from "../../../db.js";
import {verify} from "jsonwebtoken";
import Authenticate from "../user/users"

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    const id = 2; // TODO - Need to get member id or member email from request/api
    const adminField = await db.select("admin").from("members").where("member_id", id).first();
    if (adminField) {
        const admin = adminField.admin;

        // TODO - Change what information from documents is actually returned
        if (admin) {
            const documents = await db("documents");
            res.json(documents);
        } else {
            const documents = await db("documents").where("shared", true).orWhere("owner", id);
            res.json(documents);
        }
    } else {
        res.json({authorized: false});
    }
}