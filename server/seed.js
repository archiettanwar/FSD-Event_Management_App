require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const Event = require("./models/Event");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const sampleEvents = [
  {
    title: "Tech Fest 2026",
    description: "Annual national level technology symposium with hackathons and keynote speakers.",
    date: new Date("2026-09-20"),
    time: "10:00 AM",
    location: "Main Auditorium, Mumbai",
  },
  {
    title: "React & Cloud Workshop",
    description: "Hands-on workshop building full stack web applications with React, Node.js, and MongoDB.",
    date: new Date("2026-09-25"),
    time: "02:00 PM",
    location: "Computer Lab 3, Pune",
  },
  {
    title: "AI & Innovation Summit",
    description: "Discover cutting-edge developments in Artificial Intelligence and Generative Tech.",
    date: new Date("2026-10-05"),
    time: "11:00 AM",
    location: "Convention Center, Bengaluru",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    // Seed Events if empty
    const existingCount = await Event.countDocuments();
    if (existingCount === 0) {
      await Event.insertMany(sampleEvents);
      console.log(`Seeded ${sampleEvents.length} initial events successfully!`);
    } else {
      console.log(`Database already has ${existingCount} events.`);
    }

    // Seed Users (Admin and Normal User) if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const userSalt = await bcrypt.genSalt(10);
      const userPassword = await bcrypt.hash("student123", userSalt);

      const adminSalt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash("admin123", adminSalt);

      await User.create([
        {
          name: "Rahul Sharma",
          email: "student@eventhub.com",
          password: userPassword,
          role: "user",
        },
        {
          name: "Admin User",
          email: "admin@eventhub.com",
          password: adminPassword,
          role: "admin",
        },
      ]);
      console.log("Seeded 2 users (student user and admin) successfully!");
    } else {
      console.log(`Database already has ${userCount} users.`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
}

seedDatabase();

