"use strict";

import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { user, pass, clientId, clientSecret, refreshToken } from "../../../email.config";
import { passwordResetEmail } from "../../../messages/email";

export default async function requestPasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
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
            to: req.headers.useremail,
            subject: "Password Reset",
            text: passwordResetEmail
        };

        transporter.sendMail(mailConfigurations, (err, info) => {
            if (err) res.status(400).json({ error: "Email was not sent successfully" });
            else res.status(200).json({ message: "Password reset request has been sent to your email" });
        });
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}