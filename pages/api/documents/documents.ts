import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../../../db.js";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = 3; // TODO - Need to get member id or member email from request/api
        const adminField = await db.select("admin").from("members").where("member_id", id).first();
        if (adminField) {
            const admin = adminField.admin;
            if (admin) {
                const documents = await db.column("document_id", "document_name").select().from("documents");
                res.json(documents);
            } else {
                const documents = await db.column("document_id", "document_name").select().from("documents").where("shared", true).orWhere("owner", id);
                res.json(documents);
            }
        } else {
            res.status(401).send({ error: "Not authenticated" });
        }
    } else {
        res.status(405).send({ error: "Method not allowed" });
    }
}