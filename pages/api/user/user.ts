"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse";
import { validateFirstName, validateLastName, validateUsername } from "../../../utils/multi/user";
import { deleteUser } from "../../../utils/server/user";
import { getMemberClaims } from "../../../utils/server/user";

export default async function AdminUsersAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
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

        const valid = validateFirstName(first_name) && validateLastName(last_name) && validateUsername(username);
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
            })
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