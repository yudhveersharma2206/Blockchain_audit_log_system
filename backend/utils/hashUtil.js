const crypto = require("crypto");

const generateHash = (logData) => {
    return crypto
        .createHash("sha256")
        .update(logData)
        .digest("hex");
};

module.exports = { generateHash };