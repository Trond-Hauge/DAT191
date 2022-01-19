import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../../../db.js";

export default async function getAllSharedDocuments(req: NextApiRequest, res: NextApiResponse) {
    const id = 5; // Temporary

    // Find member using the member_id
    // If no results are found, the user is not logged in
    const result = await db("members").where("member_id", id);
    if (result.length > 0) {
        // The result is a list, but there can be only 1 member corresponding to any given id
        // Then check to see if this member is an admin user. If so, they have access to all documents.
        const member = result[0];
        const admin = member.admin;
        if (admin) {
            const documents = await db("documents");
            res.json(documents);
        } else {
            console.log("Not Admin")
            const documents = await db("documents").where("shared", true);
            res.json(documents);
        }
    } else {
        res.json(["Not logged in"]);
    }
}