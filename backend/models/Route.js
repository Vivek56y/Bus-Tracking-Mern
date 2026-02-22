const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, trim: true },
    startPoint: { type: String, required: true, trim: true },
    endPoint: { type: String, required: true, trim: true },
    stops: { type: [String], default: [] },
    distanceKm: { type: Number, default: null },
    estimatedTimeMinutes: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);
