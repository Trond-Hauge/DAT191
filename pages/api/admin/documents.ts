"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse";
import { authorisedAdmin } from "../../../utils/server/admin";
import { deleteFile } from "../../../firebase";

export default async function AdminPublicationsAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const documents = await db.select("document_name", "document_id").from("documents");
        res.status(200).json({documents});
    }
    else if (req.method === "PATCH") {
        const cookie = req.cookies.auth;
        const authorised = await authorisedAdmin(cookie);
        if (!authorised) {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        const title = req.body.title;
        const desc = req.body.desc;
        const _public = req.body.public;
        const id = req.body.id;

        try {
            await db("documents").where("document_id", id).update({
                document_name: title,
                document_description: desc,
                public: _public,
            });

            res.status(200).json({ message: "Document was updated." });
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
            const doc = await db("documents").where("document_id", id).first();
            await deleteFile(doc.fileref);
            await db("documents").where("document_id", id).del();
            res.status(200).json({ message: "Document was deleted." });
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