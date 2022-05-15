"use strict";

import { verify } from "jsonwebtoken";
import { db } from "../../db";
import { deleteFile } from "../../firebase";

/**
 * @param {*} cookie Serialized cookie, without name prefix.
 * @returns claims object containing all member claims. Upon no cookie or error, values will be empty strings.
 */
export function getMemberClaims(cookie) {
    let claims = {
        permission: null,
        email: null,
        id: null
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

export async function deleteUser(member) {
    if (member) {
        try {
            const documents = await db("documents").where("owner", member.member_id);
            documents.forEach( async doc => {
                await deleteFile(doc.fileref);
            })
            
            await db("members").where("member_id", member.member_id).del();
        }
        catch (error) {
            console.error(error);
        }
    }
}