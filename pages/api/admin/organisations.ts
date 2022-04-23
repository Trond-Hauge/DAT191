"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse";
import { authorisedAdmin } from "../../../utils/server/admin";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "../../../messages/apiResponse";

export default async function AdminOrganisationsAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const organisations = await db.select("organisation_name", "organisation_id").from("organisations");
        res.status(200).json({organisations});
    }
    else if (req.method === "PATCH") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const id = req.body.id;
        const orgName = req.body.orgName;
        if (!id) {
            res.status(400).json(BAD_REQUEST);
            return;
        }

        try {
            await db("organisations").where("organisation_id", id).update({
                organisation_name: orgName
            });

            res.status(200).json({ message: "Organisation was updated." });
        }
        catch (error) {
            res.status(500).json(INTERNAL_SERVER_ERROR);
        }
    }
    else if (req.method === "DELETE") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const id = req.body.id;
        if (!id) {
            res.status(400).json(BAD_REQUEST);
            return;
        }

        try {
            await db("members_organisations").where("organisation_id", id).del();
            await db("organisations").where("organisation_id", id).del();
            res.status(200).json({ message: "Organisation was updated." });
        }
        catch (error) {
            console.error(error);
            res.status(500).json(INTERNAL_SERVER_ERROR);
        }
    }
    else if (req.method === "POST") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const orgName = req.body.orgName;
        const leaderID = req.body.leaderID;

        try {
            await db("organisations").insert({
                organisation_name: orgName,
                fk_leader: leaderID
            });

            res.status(200).json({ message: "Organisation was updated." });
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