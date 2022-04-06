"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    console.log("Cookie to log out: ",req.cookies?.auth);
    res.setHeader("Set-Cookie", cookie.serialize("auth", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: -1,
        path: "/", //root of domain
    }));
    res.send({});
}