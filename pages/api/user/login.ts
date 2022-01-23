"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

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

                res.setHeader("authorization", jwt);
                res.json({authToken: jwt});
            } else {
                res.json({message: "Oof."});
            }
        });

       
        // If it doesn't work, check: https://www.youtube.com/watch?v=R1f43FmHu7w&ab_channel=WalkThroughCode

    } else {
        res.status(405).json({ message: "The request was not a POST request!" });
    }
}

// For the login part:
// Continue tutorial at 32:00 : https://www.youtube.com/watch?v=j4Tob0KDbuQ&ab_channel=BrunoAntunes