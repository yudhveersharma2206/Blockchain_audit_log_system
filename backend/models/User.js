const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must not exceed 20 characters"],
      index: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "auditor", "viewer"],
        message: "Role must be admin, auditor, or viewer"
      },
      default: "viewer",
      index: true
    }
  },
  { timestamps: true }
);

// Index for efficient queries
UserSchema.index({ username: 1, role: 1 });

module.exports = mongoose.model("User", UserSchema);