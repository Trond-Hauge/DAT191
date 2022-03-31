"use strict";

import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { user, pass, clientId, clientSecret, refreshToken } from "../../../email.config";
import { passwordResetEmail } from "../../../messages/email";

export default async function requestPasswordReset(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const email = req.headers.useremail;

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
            text: passwordResetEmail
        };

        transporter.sendMail(mailConfigurations, (err, info) => {
            // TODO - Create an instance for resetting password for this user that expires after a set amount of time
        });

        res.status(200).json({ message: "An email for resetting your password has been sent." })
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}