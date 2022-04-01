"use strict";

import { db } from "../../../db"
import { NextApiRequest, NextApiResponse } from "next";
import { passwordResetTimeoutMinutes } from "../../../next.config"
import { securePassword } from "../../../utils/user";

export default async function processPasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        const key = req.body.reset_key;
        const pass = req.body.password;
        const resetRequest = await db("password_reset").where("reset_key", key).first();
        const valid = isValid(resetRequest);
        if (valid) {
            try {
                const securePass = securePassword(pass);
                await db("members").where("member_id", resetRequest.member_id).update({password: securePass})
                await db("password_reset").where("reset_key", key).del();
                res.status(200).json({ message: "Password has been updated." });
            }
            catch (error) {
                res.status(500).json({ error: "Failed to update database" });
            }
        }
        else {
            res.status(207).json({ message: "This password does not match the requirements." });
        }
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