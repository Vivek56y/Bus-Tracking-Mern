const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { authRequired } = require("../middleware/auth");

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
router.post("/", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { routeId, from, to, travelDate, seats, amount } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!routeId || !from || !to || !travelDate) {
      return res.status(400).json({ message: "routeId, from, to, travelDate are required" });
    }

    const seatList = Array.isArray(seats) ? seats.map(normalizeSeat).filter(Boolean) : [];
    if (seatList.length === 0) {
      return res.status(400).json({ message: "Please select at least one seat" });
    }

    // Check if any seat already booked
    const existing = await Booking.find({
      routeId: String(routeId),
      travelDate: String(travelDate),
      status: "confirmed",
      seats: { $in: seatList },
    }).select("seats");

    if (existing.length > 0) {
      const taken = new Set();
      for (const b of existing) {
        for (const s of b.seats || []) {
          const ns = normalizeSeat(s);
          if (seatList.includes(ns)) taken.add(ns);
        }
      }
      return res.status(409).json({
        message: "Some selected seats are already booked",
        takenSeats: Array.from(taken),
      });
    }

    const safeAmount = typeof amount === "number" ? amount : Number(amount);

    const booking = await Booking.create({
      userId,
      routeId: String(routeId),
      from: String(from),
      to: String(to),
      travelDate: String(travelDate),
      seats: seatList,
      amount: Number.isFinite(safeAmount) ? safeAmount : 0,
      status: "confirmed",
    });

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get my bookings
router.get("/my", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    const list = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
