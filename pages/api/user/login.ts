"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { loginCookieMaxAge } from "../../../app.config";
import cookie from "cookie";
import { INCORRECT_LOGIN, METHOD_NOT_ALLOWED } from "../../../messages/apiResponse";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const member = await db("members").where("email", req.body.email as string).first();
        if (!member) {
            res.status(207).json(INCORRECT_LOGIN);
            return;
        }
                
        compare(req.body.password, member.password, (err, result) => {
            if(!err && result) {
                //consider adding more features to the claims, but not anything personal. Make a hash for this purpose?
                const claims =  {sub: member.member_id, memberEmail: member.email, permission: member.permission };
                const jwt = sign(claims, process.env.JWT_SECRET, {expiresIn: `${loginCookieMaxAge / 3600}h`});

                const authCookie = cookie.serialize("auth", jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: loginCookieMaxAge, 
                    path: "/", //root of domain
                })

                const permCookie = cookie.serialize("permission", member.permission, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: loginCookieMaxAge, 
                    path: "/", //root of domain
                })

                res.setHeader("Set-Cookie", [authCookie, permCookie])
                res.status(200).json({ message: "Login successful." });
            }
            else {
                console.error(err);
                res.status(207).json(INCORRECT_LOGIN);
            }
        });
    }
    else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}