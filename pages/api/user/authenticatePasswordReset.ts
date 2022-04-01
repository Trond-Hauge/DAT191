"use strict";

import { db } from "../../../db"
import { NextApiRequest, NextApiResponse } from "next";
import { passwordResetTimeoutMinutes } from "../../../next.config"

export default async function authenticatePasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const key = req.headers.reset_key;
        const resetRequest = await db("password_reset").where("reset_key", key).first();
        if (resetRequest && isValid(resetRequest)) res.status(200).json({ authorised: true });
        else res.status(401).json({ authorised: false });
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

function isValid(resetRequest) {
    if (!resetRequest) return false;
    const timestamp = new Date(resetRequest.timestamp).valueOf();
    const ageInMinutes = (Date.now() - timestamp) / 1000 / 60;
    return ageInMinutes < passwordResetTimeoutMinutes;
}