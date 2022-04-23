"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse";
import { validateFirstName, validateLastName, validateUsername } from "../../../utils/multi/user";
import { authorisedAdmin } from "../../../utils/server/admin";
import { deleteUser, getMemberClaims } from "../../../utils/server/user";

export default async function AdminUsersAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const members = await db.select("first_name", "last_name", "member_id", "email").from("members");
        res.status(200).json({members});
    }
    else if (req.method === "PATCH") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const userEmail = req.body.email;
        const perm = req.body.permission;
        const id = req.body.id;

        const valid = validateFirstName(firstName) && validateLastName(lastName) && validateUsername(username);
        if (valid) {
            try {
                await db("members").where("member_id", id).update({
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    email: userEmail,
                    permission: perm
                });

                res.status(200).json({ message: "User has been updated." });
            }
            catch (error) {
                res.status(500).json(INTERNAL_SERVER_ERROR);
            }
        }
        else {
            res.status(207).json({ message: "Some of the changed details are invalid!" });
        }
    }
    else if (req.method === "DELETE") {
        const cookie = req.cookies.auth;
        const { email, permission } = getMemberClaims(cookie);
        const member = await db("members").where("email", email).first();
        if (!member || permission !== "admin") {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const id = req.body.id;
        if (!id) {
            res.status(400).json(BAD_REQUEST);
            return;
        }

        try {
            const member = await db("members").where("member_id", id).first();
            await deleteUser(member);
            res.status(200).json({ message: "User has been deleted." });
        }
        catch (error) {
            res.status(500).json(INTERNAL_SERVER_ERROR);
        }
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}