require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Use public DNS servers to resolve MongoDB Atlas SRV records reliably on Windows/local networks
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Fallback to system resolver
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
