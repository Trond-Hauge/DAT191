"use strict";

import nodemailer from "nodemailer";

/**
 * Asynchronous function for sending email from the service account to a user.
 * @param {*} receivingUser Email address of the receiving user.
 * @param {*} subject Email subject.
 * @param {*} text Email text.
 */
export async function sendMail(receivingUser, subject, text) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

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
        to: receivingUser,
        subject,
        text
    };

    await new Promise( (resolve, reject) => {
        transporter.sendMail(mailConfigurations, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                console.log(info);
                resolve(info);
            }
        });
    });
}