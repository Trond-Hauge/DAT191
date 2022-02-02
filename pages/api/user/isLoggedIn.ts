"use strict";

import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { verify } from "jsonwebtoken";

const authenticator = (fn: NextApiHandler) => async (
    req: NextApiRequest,
    res: NextApiResponse
) => {    
    verify(req.cookies.auth!, process.env.JWT_SECRET, async function (err, decoded) {
        console.log("Am I logged in???");
        
        if (!err && decoded) {
            res.json({ loggedIn: true });            
            return await fn(req, res);
        }
        res.json({ loggedIn: false });
    })
};

export default authenticator(async function getContext(
    req: NextApiRequest,
    res: NextApiResponse
) {});