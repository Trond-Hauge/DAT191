"use strict";

import { db } from "../../../db"
import { NextApiRequest, NextApiResponse } from "next";
import { validatePassword, validatePasswordResetRequest } from "../../../utils/multi/validation";
import { passwordSaltRounds } from "../../../app.config";
import { hash } from "bcrypt";

export default async function processPasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        const key = req.body.reset_key;
        const pass = req.body.password;
        const validPass = validatePassword(pass);
        const resetRequest = await db("password_reset").where("reset_key", key).first();
        const validRequest = validatePasswordResetRequest(resetRequest);

        if (resetRequest && !validRequest) {
            await db("password_reset").where("reset_key", key).del();
        }

        if (!validRequest) {
            res.status(401).json({ error: "Invalid Reset Request." });
        }
        else if (!validPass) {
            res.status(207).json({ message: "This password does not match the requirements." });
        }
        else {
            hash(pass, passwordSaltRounds, async (err, hash) => {
                if (err) {
                    res.status(500).json({ error: "Internal Server Error." });
                }
                else {
                    try {
                        await db("members").where("email", resetRequest.email).update({password: hash})
                        await db("password_reset").where("reset_key", key).del();
                        res.status(200).json({ message: "Password has been updated." });
                    }
                    catch (error) {
                        res.status(500).json({ error: "Internal Server Error" })
                    }
                }
            })
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}