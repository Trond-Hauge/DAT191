"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, NOT_AUTHORISED } from "../../../messages/apiResponse.js";
import { getMemberClaims } from "../../../utils/server/user";

const B_TO_MB = 0.00000095367432;

export default async function getDocuments(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { id, permission } = getMemberClaims(req.cookies.auth);
        const { name, desc, filename, fileref } = req.body;
        const _public = req.body.public;

        if (permission !== "admin" && permission !== "verified") {
            res.status(401).json(NOT_AUTHORISED);
            return;
        }

        try {
            await db("documents").insert({
                document_name: name,
                document_description: desc,
                public: _public,
                filename,
                fileref,
                owner: id
            })

            res.status(200).json({ message: "Document uplaoded successfully" });
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