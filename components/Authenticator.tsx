"use strict";

import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { verify } from "jsonwebtoken";
import { useRouter } from "next/router";

export function Authenticator (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const router = useRouter();
    verify(req.headers.authorization!, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            router.push("/");
        } else {
            return router.push(router.route);
        }
    })
};