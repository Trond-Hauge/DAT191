"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const member = await db("members").where("email", req.body.email as string).select("*").first();

        console.log(member.password);
        
        // ToDo: All the other logic. F.ex. catching empty return, where user was not found.
        compare(req.body.password, member.password, function (err, result) {
            if(!err && result) {
                //consider adding more features to the claims, but not anything personal. Make a hash for this purpose?
                const claims =  {sub: member.member_id, memberEmail: member.email};
                const jwt = sign(claims, process.env.JWT_SECRET, {expiresIn: "1h"});

                res.setHeader("Set-Cookie", cookie.serialize("auth", jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 3600, //1h
                    path: "/", //root of domain
                }));
                res.json({ loggedIn: true });
            } else {
                res.json({ loggedIn: false });
            }
        });

    } else {
        res.status(405).json({ message: "The request was not a POST request!" });
    }
}