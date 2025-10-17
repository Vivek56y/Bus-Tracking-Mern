require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDb = require("./config/db");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
connectDb();

// Routes
const busRoutes = require("./routes/busRoutes");
app.use("/api/buses", busRoutes);

// Simple route
app.get("/", (req, res) => {
  res.send("✅ MERN Bus Tracker Backend Running & DB Connected!");
});

// Create server instance for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend access
    methods: ["GET", "POST"],
  },
});

// 🔌 WebSocket connection setup
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  // Example: send real-time updates when buses change
  socket.on("busLocationUpdate", (data) => {
    console.log("📍 Bus location updated:", data);
    io.emit("updateBusLocation", data); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
