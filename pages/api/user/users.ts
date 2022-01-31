"use strict";

import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { db } from "../../../db.js";
import { verify } from "jsonwebtoken";

const authenticated = (fn: NextApiHandler) => async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            console.log("Hippidy-hoppidy!");
            
            return await fn(req, res);
        }
        console.log("oof!");
        
        res.status(500).json({ message: "You are not authenticated." });
    })
};

export default authenticated(async function getUsers(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const users = await db("members").select("*");

    res.json({users, message: "User authorized."});
});