/**
 * Input Validation Utilities
 */

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateUsername = (username) => {
    // Username: 3-20 chars, alphanumeric and underscore
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

const validatePassword = (password) => {
    // Min 6 chars, at least one uppercase, one lowercase, one number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
};

const validateAction = (action) => {
    return typeof action === "string" && action.trim().length > 0 && action.length <= 200;
};

const validateUser = (user) => {
    return typeof user === "string" && user.trim().length > 0 && user.length <= 100;
};

const validateRole = (role) => {
    return ["admin", "auditor", "viewer"].includes(role);
};

const validateIP = (ip) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
};

module.exports = {
    validateEmail,
    validateUsername,
    validatePassword,
    validateAction,
    validateUser,
    validateRole,
    validateIP,
};
