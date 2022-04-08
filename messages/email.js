"use strict";

import { server } from "../next.config"

export function passwordResetRequest(key) {
return `
Click on this link to reset your password:
${server}/user/password-reset/${key}

If you have not requested a password reset, please ignore this email.
`}

export const passwordReset = `
Your password has been reset.

If you have not requested a password reset, please do so by following
this link and clicking on "Forgot password?":
${server}/user/login 
`;