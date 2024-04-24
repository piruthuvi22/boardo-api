const mongoose = require("mongoose");

module.exports = mongoose.model("Reservation", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Places",
  },
  checkIn: {
    type: Date,
    default: null,
  },
  checkOut: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    default: "PENDING",
  },
});
