"use strict";

import EmailValidator from "email-validator";
import { passwordResetTimeoutMinutes, passwordRequirements, firstNameRequirements, lastNameRequirements, usernameRequirements } from "../../app.config";

/**
 * @param pass Password to be validated
 * @returns true if password is valid, false if not
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

    if (lowerCount < passwordRequirements.minLowerCase || upperCount < passwordRequirements.minUpperCase) return false;

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

export function validateEmail(email) {
    return EmailValidator.validate(email);
}

export function validateFirstName(name) {
    if (!name) return false;
    const length = name.length;
    return length >= firstNameRequirements.minLength && length <= firstNameRequirements.maxLength;
}

export function validateLastName(name) {
    if (!name) return false;
    const length = name.length;
    return length >= lastNameRequirements.minLength && length <= lastNameRequirements.maxLength;
}

export function validateUsername(username) {
    if (!username) return false;
    const length = username.length;
    return length >= usernameRequirements.minLength && length <= usernameRequirements.maxLength;
}

function isLowerCase(char) {
    return !"0123456789".includes(char) && char === char.toLowerCase();
}

function isUpperCase(char) {
    return !"0123456789".includes(char) && char === char.toUpperCase();
}