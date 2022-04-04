"use strict";

import { passwordResetTimeoutMinutes, passwordRequirements } from "../app.config";

/**
 * 
 * @param {*} pass Password to be validated
 * @returns true if password is valid
 */
export function validatePassword(pass) {
    if (!pass || pass.length < passwordRequirements.minLength || pass.length > passwordRequirements.maxLength) return false;

    let lowerCount = 0;
    let upperCount = 0;
    for (let i = 0; i < pass.length; i++) {
        const char = pass.charAt(i);
        if (!passwordRequirements.allowedChars.includes(char)) return false;
        else if (isUpperCase(char)) upperCount++;
        else if (isLowerCase(char)) lowerCount++;
    }

    if (lowerCount < passwordRequirements.minLowerCase || upperCount < passwordRequirements.minUpperCase) {console.log("wut");  return false;}

    for (let i = 0; i < passwordRequirements.bannedSequences.length; i++) {
        if ( pass.includes(passwordRequirements.bannedSequences[i]) ) return false;
    }

    return true;
}

export function validatePasswordResetRequest(resetRequest) {
    if (!resetRequest) return false;
    const timestamp = new Date(resetRequest.timestamp).valueOf();
    const ageInMinutes = (Date.now() - timestamp) / 1000 / 60;
    return ageInMinutes < passwordResetTimeoutMinutes;
}

function isLowerCase(char) {
    return !"0123456789".includes(char) && char === char.toLowerCase();
}

function isUpperCase(char) {
    return !"0123456789".includes(char) && char === char.toUpperCase();
}