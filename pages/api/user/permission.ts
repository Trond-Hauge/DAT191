"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";

/**
 * Returns the permission level of the user upon receiving a GET request.
 * If user is not logged in, permission is set to 'false'.
 * @param req 
 * @param res 
 */
export default async function permission(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        let email = "";
        verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
            if (!err && decoded?.memberEmail) email = decoded.memberEmail;
        });

        const member = await db("members").where("email",email).first();
        if (!member) {
            res.status(200).json({ permission: false })
        }
        else {
            res.status(200).json({ permission: member.permission });
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
