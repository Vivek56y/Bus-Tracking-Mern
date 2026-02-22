const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    assignedBusId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", default: null },
    lastLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      speedKmph: { type: Number, default: null },
      lastUpdatedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
