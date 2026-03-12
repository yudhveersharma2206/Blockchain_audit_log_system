const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
    {
        index: { 
            type: Number, 
            required: true, 
            unique: true,
            index: true 
        },
        logId: { 
            type: String, 
            required: true, 
            index: true 
        },
        action: { 
            type: String, 
            required: true,
            index: true 
        },
        user: { 
            type: String, 
            required: true,
            index: true 
        },
        ipAddress: { 
            type: String 
        },
        timestamp: { 
            type: Date, 
            default: Date.now,
            index: true 
        },
        previousHash: { 
            type: String, 
            required: true 
        },
        hash: { 
            type: String, 
            required: true,
            unique: true,
            index: true 
        }
    },
    { timestamps: true }
);

// Compound index for efficient filtering
LogSchema.index({ user: 1, timestamp: -1 });
LogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model("Log", LogSchema);