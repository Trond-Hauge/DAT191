"use strict";

import nodemailer from "nodemailer";

/**
 * 
 * @param {*} receivingUser Email of the receiving user
 * @param {*} subject Email subject
 * @param {*} text Email text
 * @param {*} callbackFunc If given, a function to be run after email is sent
 */
export function sendMail(receivingUser, subject, text, callbackFunc) {
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

    transporter.sendMail(mailConfigurations, callbackFunc);
}