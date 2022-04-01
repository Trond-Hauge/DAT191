"use strict";

import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { user, pass, clientId, clientSecret, refreshToken } from "../../../email.config";
import { passwordResetKeyLength } from "../../../next.config"
import { passwordResetRequest } from "../../../messages/email";
import { db } from "../../../db"

export default async function requestPasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const email = req.headers.useremail;
        const resetKey = createResetKey(passwordResetKeyLength);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user,
                pass,
                clientId,
                clientSecret,
                refreshToken
            }
        });
        
        const mailConfigurations = {
            from: user,
            to: email,
            subject: "Password Reset",
            text: passwordResetRequest(resetKey)
        };

        transporter.sendMail(mailConfigurations, async (err, info) => {
            const member = await db("members").where("email", email).first();
            if (member) {
                db("password_reset").insert({
                    reset_key: resetKey,
                    member_id: member.member_id
                }).catch( err => console.log(err) );
            }
        });

        res.status(200).json({ message: "An email for resetting your password has been sent." })
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

function createResetKey(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}