"use strict";

import { passwordRequirements } from "../app.config";

export const passwordRequirementsText = `
    Have a length between ${passwordRequirements.minLength} - ${passwordRequirements.maxLength} characters.
    ${passwordRequirements.minUpperCase === 0 ? "" : `Have at least ${passwordRequirements.minUpperCase} upper case character${passwordRequirements.minUpperCase === 1 ? "." : "s."}`}
    ${passwordRequirements.minLowerCase === 0 ? "" : `Have at least ${passwordRequirements.minLowerCase} lower case character${passwordRequirements.minLowerCase === 1 ? "." : "s."}`}
    Not contain easy to guess sequences such as "12345" or "password".
`