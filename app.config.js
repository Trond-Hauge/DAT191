module.exports = {
    loginCookieMaxAge: 3600, // Seconds 
    maxFileSizeBytes: 10 * 1024 * 1024, // 10MB
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