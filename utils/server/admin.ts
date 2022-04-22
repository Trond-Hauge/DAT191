"use strict";

import { getMemberClaims } from "./user";
import { db } from "../../db";

export async function authorisedAdmin(cookie) {
    const { email, permission } = getMemberClaims(cookie);
    const member = await db("members").where("email", email).first();
    return member && permission === "admin";
}