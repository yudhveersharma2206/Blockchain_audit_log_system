/**
 * Blockchain Audit Log Controller
 * Handles:
 *  - Adding new blocks
 *  - Verifying blockchain integrity
 *  - Fetching full blockchain
 */
const Log = require("../models/log");
const { generateHash } = require("../utils/hashUtil");
const { validateAction, validateUser } = require("../utils/validation");

/**
 * Adds a new block to the blockchain.
 * Generates SHA-256 hash including previousHash linking.
 */
const addLog = async (req, res) => {
    try {
        const { action, user } = req.body;

        // Validation
        if (!action || !user) {
            return res.status(400).json({
                success: false,
                message: "Action and User are required"
            });
        }

        if (!validateAction(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be between 1-200 characters"
            });
        }

        if (!validateUser(user)) {
            return res.status(400).json({
                success: false,
                message: "User must be between 1-100 characters"
            });
        }

        // Get last block
        const lastBlock = await Log.findOne().sort({ index: -1 });

        // Calculate new block properties
        const index = lastBlock ? lastBlock.index + 1 : 1;
        const previousHash = lastBlock ? lastBlock.hash : "0";
        const logId = Date.now().toString();
        const ip = req.ip || req.connection.remoteAddress || "unknown";
        const timestamp = new Date().toISOString();

        // Generate hash
        const logData = index + logId + action + user + ip + timestamp + previousHash;
        const hash = generateHash(logData);

        // Create and save new block
        const newBlock = new Log({
            index,
            logId,
            action,
            user,
            ipAddress: ip,
            timestamp,
            previousHash,
            hash
        });

        await newBlock.save();

        res.status(201).json({
            success: true,
            message: "Block added successfully",
            block: newBlock
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add block",
            error: error.message
        });
    }
};

/**
 * Verifies full blockchain integrity.
 * Recalculates hashes and checks previousHash linkage.
 */
const verifyLog = async (req, res) => {
    try {
        const blocks = await Log.find().sort({ index: 1 });

        if (blocks.length === 0) {
            return res.json({
                success: true,
                status: "✅ Blockchain is empty",
                tampered: false
            });
        }

        for (let i = 0; i < blocks.length; i++) {
            const current = blocks[i];

            // Recalculate hash
            const recalculatedHash = generateHash(
                current.index +
                current.logId +
                current.action +
                current.user +
                current.ipAddress +
                new Date(current.timestamp).toISOString() +
                current.previousHash
            );

            // Check if current block is tampered
            if (current.hash !== recalculatedHash) {
                return res.json({
                    success: false,
                    status: `❌ Block ${current.index} tampered`,
                    tamperedBlock: current.index,
                    tampered: true
                });
            }

            // Check chain linkage (except for genesis block)
            if (i > 0 && current.previousHash !== blocks[i - 1].hash) {
                return res.json({
                    success: false,
                    status: `❌ Chain broken at block ${current.index}`,
                    brokenAt: current.index,
                    tampered: true
                });
            }
        }

        res.json({
            success: true,
            status: "✅ Blockchain is valid",
            totalBlocks: blocks.length,
            tampered: false
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Verification failed",
            error: error.message
        });
    }
};

/**
 * Get all blocks with optional pagination
 */
const getAllBlocks = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 50);
        const skip = (page - 1) * limit;

        const totalBlocks = await Log.countDocuments();
        const blocks = await Log.find()
            .sort({ index: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            success: true,
            pagination: {
                total: totalBlocks,
                page,
                limit,
                pages: Math.ceil(totalBlocks / limit)
            },
            blockchain: blocks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching blocks",
            error: error.message
        });
    }
};

/**
 * Get a single block by ID
 */
const getBlockById = async (req, res) => {
    try {
        const block = await Log.findById(req.params.id);

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Block not found"
            });
        }

        res.json({
            success: true,
            block
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching block",
            error: error.message
        });
    }
};

/**
 * Filter blocks by user, action, or date range
 */
const filterBlocks = async (req, res) => {
    try {
        const { user, action, startDate, endDate, page = 1, limit = 50 } = req.query;

        const filter = {};

        if (user) filter.user = new RegExp(user, "i");
        if (action) filter.action = new RegExp(action, "i");

        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit));
        const totalBlocks = await Log.countDocuments(filter);
        const blocks = await Log.find(filter)
            .sort({ index: -1 })
            .skip(skip)
            .limit(Math.min(100, parseInt(limit)))
            .lean();

        res.json({
            success: true,
            pagination: {
                total: totalBlocks,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(totalBlocks / Math.min(100, parseInt(limit)))
            },
            blocks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error filtering blocks",
            error: error.message
        });
    }
};

module.exports = {
    addLog,
    verifyLog,
    getAllBlocks,
    getBlockById,
    filterBlocks
};