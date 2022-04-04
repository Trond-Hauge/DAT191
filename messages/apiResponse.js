"use strict";

import { passwordResetTimeoutDays } from "../app.config";

export const methodNotAllowed = { error: "Method not allowed." };

export const passwordResetRequested = { message: 
    `You should receive an email to reset your password shortly. Please note that you 
    are only able to reset your password once every ${passwordResetTimeoutDays} days.` 
};