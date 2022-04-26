"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { sign } from "jsonwebtoken";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    const jwt = sign({}, process.env.JWT_SECRET, {expiresIn: "0h"});
    res.setHeader("Set-Cookie", cookie.serialize("auth", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: -1,
        path: "/", //root of domain
    }));
    res.json({});
}