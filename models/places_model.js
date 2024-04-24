const mongoose = require("mongoose");

module.exports = mongoose.model("Places", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrls: {
    type: Array,
  },
  rating: {
    type: Number,
  },
  coordinates: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  facilities: {
    roomType: {
      type: String,
    },
    noOfBeds: {
      type: Number,
    },
    washRoomType: {
      type: Array,
    },
    facilities: [
      {
        type: String,
        ref: "Facilities",
      },
    ],
    paymentType: {
      type: String,
      default: "Monthly",
    },
  },
  cost: {
    type: Number,
  },
  status: {
    type: String,
    default: "AVAILABLE", // AVAILABLE,PENDING, RESERVED, BLOCKED
  },
});
