"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db.js";
import { METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse.js";
import { getMemberClaims } from "../../../utils/server/user.js";

export default async function AdminPublicationsAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookie = req.cookies.auth;
        const { email, permission } = getMemberClaims(cookie);
        const member = await db("members").where("email", email).first();

        if (!member || permission !== "admin") {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const documents = await db.select("document_name", "document_id").from("documents");
        res.status(200).json({documents});
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}