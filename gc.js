"use strict";

import { Storage } from "@google-cloud/storage";

const private_key = process.env.GC_PRIVATE_KEY.split(`\\n`).join("\n");

export const gc = new Storage({
    projectId: process.env.GC_PROJECT_ID,
    credentials: {
        client_email: process.env.GC_CLIENT_EMAIL,
        private_key
    }
});