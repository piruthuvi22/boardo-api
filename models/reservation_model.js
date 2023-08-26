const mongoose = require("mongoose");

const reservation = mongoose.Schema({
  UserId: {
    type: String,
  },
  PlaceId: {
    type: String,
  },
});

module.exports = mongoose.model("Reservation",reservation);
