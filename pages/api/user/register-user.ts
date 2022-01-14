import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { hash } from "bcrypt";

// NOT TESTED!!
export default async function registerUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        hash(req.body.password, 10, async (err, hash) => {

            // Set try/ catch, as email should be unique, and may therefore be rejected
            await db("member").insert({
                frist_name: req.body.frist_name,
                last_name: req.body.last_name,
                email: req.body.email, // Add a unique constraint to the database
                username: req.body.username,
                password: hash,
            });
        });
        // If it doesn't work, check: https://www.youtube.com/watch?v=R1f43FmHu7w&ab_channel=WalkThroughCode
    } else {
        res.status(405).json({ message: "The request was not a POST request!" });
    }
}

// For the login part:
// Continue tutorial at 32:00 : https://www.youtube.com/watch?v=j4Tob0KDbuQ&ab_channel=BrunoAntunes