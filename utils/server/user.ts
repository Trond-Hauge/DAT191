"use strict";

import { verify } from "jsonwebtoken";
import { db } from "../../db";
import { gc } from "../../gc";

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

export async function deleteUser(member) {
    if (member) {
        const documents = await db("documents").where("owner", member.member_id);
        const organisations = await db("organisations").where("fk_leader", member.member_id);

        if (documents) {
            for (let i = 0; i < documents.length; i++) {
                const doc = documents.at(i);
                const exists = await gc.file(doc.filename).exists();
                if (exists) gc.file(doc.filename).delete();
            }
        }

        if (organisations) {
            for (let i = 0; i < organisations.length; i++) {
                await db("members_organisations").where("organisation_id", organisations.at(i).organisation_id).del();
            }
        }

        await db("documents").where("owner", member.member_id).del();
        await db("password_reset").where("email", member.email).del();
        await db("members_organisations").where("member_id", member.member_id).del();
        await db("organisations").where("fk_leader", member.member_id).del();
        await db("members").where("member_id", member.member_id).del();
    }
}