import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../../../db.js";

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookie = req.headers.cookie;
        const id = 1; // TODO - Need to get member id or member email from request/api
        const user = await db("members").where("member_id", id).first();
        if (user) {
            if (user.admin) {
                const documents = await db.column("document_id", "document_name", "document_description").select().from("documents");
                res.json(documents);
            } else {
                const documents = await db.column("document_id", "document_name", "document_description").select().from("documents").where("shared", true).orWhere("owner", id);
                res.json(documents);
            }
        } else {
            res.status(401).send({ error: "Not authenticated" });
        }
    } else {
        res.status(405).send({ error: "Method not allowed" });
    }
}