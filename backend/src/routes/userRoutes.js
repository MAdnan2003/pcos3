import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/requireAdmin.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * =========================
 * ADMIN: GET ALL USERS (with search)
 * =========================
 */
router.get("/", auth, admin, async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search.trim()
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const users = await User.find(query).select("-password");

    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * ADMIN: CREATE USER
 * =========================
 * Allows admin to add users from dashboard
 */
router.post("/", auth, admin, async (req, res) => {
  try {
    const { name, email, password, status } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password: password || "password123", // default if admin adds user
      status: status || "active"
    });

    await newUser.save(); // role auto-assigned by email

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (err) {
    console.error("Failed to add user:", err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * =========================
 * ADMIN: DELETE USER
 * =========================
 */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * ADMIN: SUSPEND / UNSUSPEND USER
 * =========================
 */
router.patch("/:id/suspend", auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "suspended" : "active";
    await user.save();

    res.json({
      message:
        user.status === "active"
          ? "User activated"
          : "User suspended",
      status: user.status
    });
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
