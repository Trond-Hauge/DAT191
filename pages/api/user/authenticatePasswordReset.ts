"use strict";

import { db } from "../../../db"
import { NextApiRequest, NextApiResponse } from "next";
import { validatePasswordResetRequest } from "../../../utils/multi/validation";

export default async function authenticatePasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const key = req.query.reset_key;
        const resetRequest = await db("password_reset").where("reset_key", key).first();
        const valid = validatePasswordResetRequest(resetRequest);

        if (resetRequest && !valid) {
            await db("password_reset").where("reset_key", resetRequest.reset_key).del();
        }

        if (valid) res.status(200).json({ authorised: true });
        else res.status(401).json({ authorised: false });
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}