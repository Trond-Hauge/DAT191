"use strict";

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";
import fs from "fs";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED } from '../../../messages/apiResponse.js';
import { maxFileSizeBytes } from '../../../app.config.js';

export default async function file(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const filepath = req.query.filepath as fs.PathOrFileDescriptor;
        const _public = req.query.public;
        const owner = req.query.owner;

        if (!filepath || !_public || !owner) {
            res.status(400).json(BAD_REQUEST);
            return;
        }

        let email = "";
        verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
            if (!err && decoded?.memberEmail) email = decoded.memberEmail;
        });
        const member = await db("members").where("email", email).first();

        if (!_public && (member?.permission !== "admin" && member.member_id !== owner)) {
            res.status(403).json({ error: "User is not authorised to view content" });
        }
        else {
            fs.readFile(filepath, (err, file) => {
                if (err) {
                    res.status(500).json(INTERNAL_SERVER_ERROR);
                }
                else {
                    res.status(200).json({file});
                }
            })
        }
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: `${maxFileSizeBytes / 1024 / 1024}mb`
        }
    }
}