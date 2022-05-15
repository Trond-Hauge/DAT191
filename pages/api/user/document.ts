"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse";
import { deleteFile } from "../../../firebase";
import { getMemberClaims } from "../../../utils/server/user";

export default async function UserPublicationAPI(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        try {
            const cookie = req.cookies.auth;
            const { id } = getMemberClaims(cookie);
            const docID = req.body.id;

            if (!docID) {
                res.status(400).json(BAD_REQUEST);
                return;
            }

            const document = await db("documents").where("document_id", docID).first();

            if (document?.owner !== id) {
                res.status(401).json(NOT_AUTHORISED);
                return;
            }

            const title = req.body.title;
            const desc = req.body.desc;
            const _public = req.body.public;

            await db("documents").where("document_id", docID).update({
                document_name: title,
                document_description: desc,
                public: _public
            });

            res.status(200).json({ message: "Document was updated" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json(INTERNAL_SERVER_ERROR);
        }
    }
    else if (req.method === "DELETE") {
        try {
            const cookie = req.cookies.auth;
            const { id } = getMemberClaims(cookie);
            const docID = req.body.id;

            if (!docID) {
                res.status(400).json(BAD_REQUEST);
                return;
            }

            const doc = await db("documents").where("document_id", docID).first();
            if (doc?.owner !== id) {
                res.status(401).json(NOT_AUTHORISED);
                return;
            }

            await deleteFile(doc.fileref);
            await db("documents").where("document_id", docID).del();
            res.status(200).json({ message: "Document was deleted" });
        }
        catch (error) {
            res.status(500).json(INTERNAL_SERVER_ERROR);
        }
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}