const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Event = require("../models/Event");

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "default_jwt_secret_2026",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// 1. User registration (POST /api/auth/register)
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// 2. User login (POST /api/auth/login)
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// 3. Token verification / Current user profile (GET /api/auth/me)
async function getMe(req, res) {
  try {
    res.status(200).json({
      message: "Token verified successfully",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// 4. Admin-only endpoint (GET /api/auth/admin-dashboard)
async function getAdminDashboard(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();

    res.status(200).json({
      message: "Welcome to the Admin Dashboard. Admin access granted!",
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      stats: {
        totalUsers,
        totalEvents,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { register, login, getMe, getAdminDashboard };

