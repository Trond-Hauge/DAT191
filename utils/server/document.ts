"use strict";

import { gc } from "../../gc";

export async function deleteFile(document) {
    if (document) {
        try {
            const existsList = await gc.file(document.filename).exists();
            const exists = existsList.some( b => b );
            if (exists) await gc.file(document.filename).delete();
        }
        catch (error) {
            console.error(error);
        }
    }
}