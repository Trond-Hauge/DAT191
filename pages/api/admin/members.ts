"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db.js";
import { METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse.js";
import { getMemberClaims } from "../../../utils/server/user.js";

export default async function AdminUsersAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookie = req.cookies.auth;
        const { email, permission } = getMemberClaims(cookie);
        const member = await db("members").where("email", email).first();

        if (!member || permission !== "admin") {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const members = await db.select("first_name", "last_name", "member_id").from("members");
        res.status(200).json({members});
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}