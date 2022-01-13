import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../../../db.js";

export default async function getAllDocuments(req: NextApiRequest, res: NextApiResponse) {
    const documents = await db.select("*").from("documents");
    res.json(documents);
    console.log(documents);
}