"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { sign } from "jsonwebtoken";
import { METHOD_NOT_ALLOWED } from "../../../messages/apiResponse";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const jwt = sign({}, process.env.JWT_SECRET, {expiresIn: "0h"});
        res.setHeader("Set-Cookie", cookie.serialize("auth", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1,
            path: "/", //root of domain
        }));

        res.json({ message: "Logged out" });
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}