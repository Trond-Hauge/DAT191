"use strict";

import { verify } from "jsonwebtoken";

/**
 * @param {*} cookie Serialized cookie, without name prefix.
 * @returns claims object containing all member claims. Upon no cookie or error, values will be empty strings.
 */
export function getMemberClaims(cookie) {
    let claims = {
        permission: "",
        email: "",
        id: ""
    };

    if (!cookie) return claims;

    verify(cookie, process.env.JWT_SECRET, function (err, decoded) {       
        if (!err && decoded) {
            claims = {
                permission: decoded.permission,
                email: decoded.memberEmail,
                id: decoded.sub
            }
        }
    });

    return claims;
}