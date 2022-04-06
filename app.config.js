module.exports = {
    loginCookieMaxAge: 30, // Seconds 
    passwordResetTimeoutMinutes: 5,
    passwordResetKeyLength: 20,
    passwordSaltRounds: 10,
    passwordRequirements: {
        minLength: 8,
        maxLength: 64,
        minUpperCase: 1,
        minLowerCase: 1,
        allowedChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        bannedSequences: ["123", "1234", "12345"]
    }
}