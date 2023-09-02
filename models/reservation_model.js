const mongoose = require("mongoose");

const reservation = mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  PlaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Places",
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Reservation", reservation);
