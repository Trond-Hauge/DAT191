module.exports = {
    loginCookieMaxAge: 3600,         // Seconds 
    maxFileSize: 10,                 // 10MBs
    passwordResetTimeoutMinutes: 30,
    passwordResetKeyLength: 20,
    passwordSaltRounds: 10,
    passwordRequirements: {
        minLength: 8,
        maxLength: 64,
        minUpperCase: 1,
        minLowerCase: 1,
        allowedChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()_-+={[}]|\\:;\"'<,>.?/",
        bannedSequences: ["12345", "password"]
    },
    firstNameRequirements: {
        minLength: 1,
        maxLength: 64
    },
    lastNameRequirements: {
        minLength: 1,
        maxLength: 32
    },
    usernameRequirements: {
        minLength: 4,
        maxLength: 16
    }
}