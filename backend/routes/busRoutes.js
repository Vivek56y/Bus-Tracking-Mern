const express = require("express");
const Bus = require("../models/Bus.js");
const router = express.Router();
const { authRequired, requireRole } = require("../middleware/auth");

function parseNumber(value) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(num) ? num : NaN;
}

// Add a new bus
// router.post("/add", async (req, res) => {
//   try {
//     const bus = new Bus({
//       busNumber: "B101",
//       driverName: "John",
//       latitude: 28.6,
//       longitude: 77.2,
//       route: "Route 1",
//     });

//     const savedBus = await bus.save();
//     res.json(savedBus);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authRequired, requireRole("admin"), async (req, res) => {
  const {
    busNumber,
    driverName,
    driverContact,
    route,
    routeId,
    driverId,
    capacity,
    busType,
    status,
    latitude,
    longitude,
  } = req.body;

  if (!busNumber || !driverName || !route) {
    return res.status(400).json({ message: "busNumber, driverName and route are required" });
  }

  const lat = parseNumber(latitude);
  const lng = parseNumber(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ message: "latitude and longitude must be valid numbers" });
  }

  const newBus = new Bus({
    busNumber,
    route,
    driverName,
    driverContact,
    routeId,
    driverId,
    capacity,
    busType,
    status,
    longitude: lng,
    latitude: lat,
  });
  try {
    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(updatedBus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const deleted = await Bus.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
