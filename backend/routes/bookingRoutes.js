const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

function normalizeSeat(seat) {
  return String(seat || "")
    .trim()
    .toUpperCase();
}

// GET booked seats for a route/date
// public so UI can show availability before login as well
router.get("/seats", async (req, res) => {
  try {
    const { routeId, travelDate } = req.query;
    if (!routeId || !travelDate) {
      return res.status(400).json({ message: "routeId and travelDate are required" });
    }

    const bookings = await Booking.find({
      routeId: String(routeId),
      travelDate: String(travelDate),
      status: "confirmed",
    }).select("seats");

    const bookedSeats = new Set();
    for (const b of bookings) {
      for (const s of b.seats || []) bookedSeats.add(normalizeSeat(s));
    }

    res.json({ bookedSeats: Array.from(bookedSeats) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create booking
router.post("/", async (req, res) => {
  try {
    const { routeId, from, to, travelDate, seats, amount, userId } = req.body;

    if (!routeId || !from || !to || !travelDate) {
      return res.status(400).json({ message: "routeId, from, to, travelDate are required" });
    }

    const seatList = Array.isArray(seats) ? seats.map(normalizeSeat).filter(Boolean) : [];
    if (seatList.length === 0) {
      return res.status(400).json({ message: "Please select at least one seat" });
    }

    // Check if any seat already booked
    const existing = await Booking.findOne({
      routeId,
      travelDate,
      status: "confirmed",
      seats: { $in: seatList },
    });

    if (existing) {
      const taken = existing.seats.filter((s) => seatList.includes(normalizeSeat(s)));
      return res.status(409).json({
        message: "Some seats are already booked",
        takenSeats: taken,
      });
    }

    const booking = new Booking({
      routeId,
      from,
      to,
      travelDate,
      seats: seatList,
      amount,
      status: "confirmed",
    });

    const saved = await booking.save();
    res.status(201).json({ message: "Booking confirmed", booking: saved });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get my bookings
router.get("/my", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    console.log("Fetching bookings for userId:", userId);
    
    // For guests, find bookings without userId
    const query = userId === "guest" ? { userId: { $exists: false } } : { userId };
    const list = await Booking.find(query).sort({ createdAt: -1 });
    
    console.log("Found bookings:", list.length);
    res.json(list);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: get all bookings
router.get("/", async (req, res) => {
  try {
    const list = await Booking.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
