"use strict";

import { verify } from "jsonwebtoken";
import { db } from "../../db";
import { deleteFile } from "../../firebase";

/**
 * @param {*} cookie Serialized cookie, without name prefix.
 * @returns claims object containing all member claims. Upon no cookie or error, values are null.
 */
export function getMemberClaims(cookie) {
    let claims = {
        permission: null,
        email: null,
        id: null
    }

    if (cookie) {
        verify(cookie, process.env.JWT_SECRET, function (err, decoded) {       
            if (!err && decoded) {
                claims = {
                    permission: decoded.permission,
                    email: decoded.memberEmail,
                    id: decoded.sub
                }
            }
        });
    }

    return claims;
}

/**
 * Deletes member and all associated database entries, in addition to files uploaded by the member.
 * @param member Object representing the member to be deleted.
 */
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