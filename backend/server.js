require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDb = require("./config/db");

const app = express();

// 🧩 Middlewares
app.use(express.json());
app.use(cors());

// 🗄️ Database Connection
connectDb();

// 🛣️ Routes
const busRoutes = require("./routes/busRoutes");
const loginRoutes = require("./routes/loginRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/buses", busRoutes);
app.use("/api/auth", loginRoutes); // Changed from /api/login → /api/auth for clarity
app.use("/api/bookings", bookingRoutes);

// 🧭 Root Test Route
app.get("/", (req, res) => {
  res.send("✅ MERN Bus Tracker Backend Running & DB Connected!");
});

// ⚡ Create server instance for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔌 WebSocket setup
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Real-time bus updates
  socket.on("busLocationUpdate", (data) => {
    console.log("📍 Bus location updated:", data);
    io.emit("updateBusLocation", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
