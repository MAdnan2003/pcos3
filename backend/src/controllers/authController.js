import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ============================
// Generate JWT Token
// ============================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ============================
// REGISTER USER
// ============================
export const register = async (req, res) => {
  try {
    const { email, password, name, profile, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      profile,
      location
    });

    await user.save(); // role auto-assigned here

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        location: user.location
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ============================
// LOGIN USER
// ============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (include password)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ BLOCK SUSPENDED USERS
    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account is suspended. Please contact the authorities."
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        profile: user.profile,
        location: user.location,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ============================
// GET CURRENT USER
// ============================
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ============================
// UPDATE USER PROFILE
// ============================
export const updateProfile = async (req, res) => {
  try {
    const { profile, location, preferences } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (profile) user.profile = { ...user.profile, ...profile };
    if (location) user.location = { ...user.location, ...location };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        location: user.location,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
