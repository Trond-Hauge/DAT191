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
            res.status(200).json({ isVerified: false });
        }
        else {
            res.status(200).json({ isVerified: true });
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
