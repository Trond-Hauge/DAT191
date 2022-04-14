"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { passwordResetKeyLength } from "../../../app.config";
import { METHOD_NOT_ALLOWED, PASSWORD_RESET_REQUESTED } from "../../../messages/apiResponse";
import { passwordResetRequest } from "../../../messages/email";
import { sendMail } from "../../../utils/server/email";
import { validatePasswordResetRequest } from "../../../utils/multi/user";
import { db } from "../../../db";

export default async function requestPasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const userEmail = req.body.email as string;
        const subject = "Password Reset";
        const resetKey = createResetKey(passwordResetKeyLength);
        const text = passwordResetRequest(resetKey);

        try {
            const resetRequest = await db("password_reset").where("email", userEmail).first();
            const valid = validatePasswordResetRequest(resetRequest);

            if (resetRequest && !valid) {
                await db("password_reset").where("reset_key", resetRequest.reset_key).del();
            }

            if (!valid) {
                db("password_reset").insert({
                    reset_key: resetKey,
                    email: userEmail
                })
                .then( () => sendMail(userEmail, subject, text) );
            }
        }
        catch (error) {
            console.error(error);
        }

        res.status(200).json(PASSWORD_RESET_REQUESTED);
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}

function createResetKey(length: Number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}