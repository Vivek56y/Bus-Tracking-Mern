const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    routeId: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    travelDate: { type: String, required: true, trim: true }, // YYYY-MM-DD

    seats: [{ type: String, required: true }],
    amount: { type: Number, required: true, min: 0 },

    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  },
  { timestamps: true }
);

bookingSchema.index({ routeId: 1, travelDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
