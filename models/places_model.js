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
  address: {
    type: String,
  },
  imageUrls: [
    {
      url: {
        type: String,
      },
      name: {
        type: String,
      },
      fileRef: {
        type: String,
      },
    },
  ],
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
  },
  paymentType: {
    type: String,
    default: "Monthly",
  },
  cost: {
    type: Number,
  },
  status: {
    type: String,
    default: "AVAILABLE", // AVAILABLE,PENDING, RESERVED, BLOCKED
  },
});
