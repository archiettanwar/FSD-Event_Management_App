require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Attach Socket.IO instance to app for controllers to emit events
app.set("io", io);

// Socket.IO connection & disconnection lifecycle logging (Screenshot 4)
io.on("connection", (socket) => {
  console.log(`[Socket.IO] Client connected successfully | Socket ID: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`[Socket.IO] Client disconnected | Socket ID: ${socket.id} | Reason: ${reason}`);
  });
});

// Middleware to read JSON request bodies
app.use(express.json());

// Enable CORS for all requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Home route
app.get("/", (req, res) => {
  res.status(200).send("Event Management API Running");
});

// Auth API routes
app.use("/api/auth", authRoutes);

// Event API routes
app.use("/api/events", eventRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running with Socket.IO at http://localhost:${PORT}`);
  });
}

startServer();