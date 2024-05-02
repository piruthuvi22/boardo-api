const mongoose = require("mongoose");

module.exports = mongoose.model("Reservation", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Places",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  checkIn: {
    type: Date,
    default: null,
  },
  checkOut: {
    type: Date,
    default: null,
  },
  noOfGuests: {
    type: Number,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    default: "PENDING",
  },
});
