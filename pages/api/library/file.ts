"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../db";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED } from '../../../messages/apiResponse';
import { maxFileSize } from '../../../app.config';
import { gc } from '../../../gc';
import { getMemberClaims } from '../../../utils/server/user';

export default async function file(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const docID = parseInt(req.query.id as string);
        const cookie = req.cookies.auth;
        const { id, permission } = getMemberClaims(cookie);

        if (!docID) {
            res.status(400).json(BAD_REQUEST);
            return;
        }

        try {
            const doc = await db.select("owner", "public", "filename").from("documents").where("document_id", docID).first();
            if (!doc?.public && permission !== "admin" && doc?.owner !== id) {
                res.status(403).json({ error: "User is not authorised to view content" });
                return;
            }

            const response = await gc.file(doc?.filename).download();
            const file = response[0];
            res.status(200).send(file);
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

export const config = {
    api: {
        bodyParser: {
            sizeLimit: `${maxFileSize}mb`
        }
    }
}