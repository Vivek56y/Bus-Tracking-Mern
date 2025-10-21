const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  route: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, {
  timestamps: true // if you want createdAt/updatedAt fields
});

module.exports = mongoose.model('Bus', busSchema);
