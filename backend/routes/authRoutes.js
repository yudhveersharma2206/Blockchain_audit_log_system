const express = require("express");
const router = express.Router();

const {
  register,
  login,
  createUser,
  getUsers,
  deleteUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);

// ADMIN USER MANAGEMENT
router.post("/create-user", authMiddleware, roleMiddleware("admin"), createUser);

router.get("/users", authMiddleware, roleMiddleware("admin"), getUsers);

router.delete("/user/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

module.exports = router;