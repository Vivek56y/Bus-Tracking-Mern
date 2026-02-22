const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, trim: true },

  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", default: null },
  route: { type: String, required: true, trim: true },

  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
  driverName: { type: String, required: true, trim: true },
  driverContact: { type: String, default: "", trim: true },

  capacity: { type: Number, default: 40, min: 1 },
  busType: { type: String, enum: ["AC", "Non-AC"], default: "Non-AC" },
  status: { type: String, enum: ["Active", "Inactive", "Delayed"], default: "Active" },

  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  speedKmph: { type: Number, default: null },
  lastUpdatedAt: { type: Date, default: null },
}, {
  timestamps: true // if you want createdAt/updatedAt fields
});

module.exports = mongoose.model('Bus', busSchema);
