const express = require("express");
const Bus = require("../models/Bus");
const router = express.Router();

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

router.post("/", async (req, res) => {
  const { busNumber, driverName, route, latitude, longitude } = req.body;

  const newBus = new Bus({
    busNumber,
    route,
    driverName,
    longitude,
    latitude,
  });
  try {
    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedBus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔴 Delete bus by ID
router.delete("/:id", async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
