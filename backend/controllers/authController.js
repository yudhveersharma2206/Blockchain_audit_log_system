const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateUsername, validatePassword, validateRole } = require("../utils/validation");

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3-20 characters, alphanumeric or underscore"
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 chars with uppercase, lowercase, and number"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      role: role || "viewer"
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message
    });
  }
};

/**
 * Login user and return JWT token
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: process.env.JWT_EXPIRY || "2h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message
    });
  }
};

/**
 * Create a new user (Admin only)
 */
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username format"
      });
    }

    if (role && !validateRole(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be: admin, auditor, or viewer"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: role || "viewer"
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User creation failed",
      error: err.message
    });
  }
};

/**
 * Get all users (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message
    });
  }
};

/**
 * Delete a user (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message
    });
  }
};

module.exports = { register, login, createUser, getUsers, deleteUser };