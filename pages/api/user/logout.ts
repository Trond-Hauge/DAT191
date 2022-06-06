"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { METHOD_NOT_ALLOWED } from "../../../messages/apiResponse";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const authCookie = cookie.serialize("auth", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1, 
            path: "/", //root of domain
        })

        const permCookie = cookie.serialize("permission", "", {
            httpOnly: false,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1, 
            path: "/", //root of domain
        })

        res.setHeader("Set-Cookie", [authCookie, permCookie])
        res.status(200).json({ message: "Logged out" });
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}