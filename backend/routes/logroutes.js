const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    addLog,
    verifyLog,
    getAllBlocks,
    getBlockById,
    filterBlocks
} = require("../controllers/logcontroller");

// Add log (block) - Admin only
router.post("/add-log", authMiddleware, roleMiddleware("admin"), addLog);

// Get all blocks
router.get("/blocks", authMiddleware, getAllBlocks);

// Filter blocks by criteria
router.get("/blocks/filter", authMiddleware, filterBlocks);

// Verify blockchain
router.get("/verify", authMiddleware, verifyLog);

// Get single block
router.get("/block/:id", authMiddleware, getBlockById);

module.exports = router;