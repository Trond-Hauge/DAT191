"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse";
import { validateEmail, validateFirstName, validateLastName, validatePassword, validateUsername } from "../../../utils/multi/validation";
import { deleteUser } from "../../../utils/server/user";
import { getMemberClaims } from "../../../utils/server/user";
import { hash } from "bcrypt";
import { passwordSaltRounds } from "../../../app.config";

export default async function AdminUsersAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const password = req.body.password;
        const first_name = req.body.firstName;
        const last_name = req.body.lastName;
        const email  = req.body.email;
        const username = req.body.username;

        const valid = validatePassword(password)
            && validateFirstName(first_name)
            && validateLastName(last_name)
            && validateEmail(email)
            && validateUsername(username);

        if (valid) {
            const member = await db("members").where("email", email).first();
            if (member) {
                res.status(207).json({ message: "This email is already registered with another account." });
            }
            else {
                hash(password, passwordSaltRounds, async (err, hash) => {
                    if (err) {
                        res.status(500).json(INTERNAL_SERVER_ERROR);
                        console.error(err);
                        return;
                    }
                    try {
                        await db("members").insert({
                            first_name,
                            last_name,
                            email,
                            username,
                            password: hash,
                            permission: "unverified"
                        });
                        res.status(200).json({ message: "User has been registered." });
                    }
                    catch (error) {
                        console.error(error);
                        res.status(500).json(INTERNAL_SERVER_ERROR);
                    }
                })
            }
        }
        else {
            res.status(207).json({ message: "One or more of the details entered do not match requirements." });
        }
    }
    else if (req.method === "PATCH") {
        const cookie = req.cookies.auth;
        const { id } = getMemberClaims(cookie);
        const userID = req.body.userID;
        if (id !== userID) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const email = req.body.email;
        const first_name = req.body.firstName;
        const last_name = req.body.lastName;
        const username = req.body.username;

        const valid = validateFirstName(first_name)
            && validateLastName(last_name)
            && validateUsername(username)
            && validateEmail(email);

        if (!valid) {
            res.status(207).json({ message: "Some of the details are invalid." });
            return;
        }

        try {
            await db("members").where("member_id", id).update({
                first_name,
                last_name,
                username,
                email
            });

            res.status(200).json({ message: "User was updated" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json(INTERNAL_SERVER_ERROR);
        }
    }
    else if (req.method === "DELETE") {
        const cookie = req.cookies.auth;
        const { id } = getMemberClaims(cookie);
        const userID = req.body.userID;
        if (id !== userID) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        try {
            const member = await db("members").where("member_id", id).first();
            await deleteUser(member);
            res.status(200).json({ message: "User has been deleted." });
        }
        catch (error) {
            console.error(error);
            res.status(500).json(INTERNAL_SERVER_ERROR);
        }
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}