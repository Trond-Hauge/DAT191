"use strict";

import { db } from "../../db";
import { gc } from "../../gc";

export async function deleteDocument(document) {
    try {
        await db("documents").where("document_id",  document.document_id).del();
        const existsList = await gc.file(document.filename).exists();
        const exists = existsList.some( b => b );
        if (exists) await gc.file(document.filename).delete();
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}