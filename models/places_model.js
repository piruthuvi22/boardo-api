const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
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
  location: {
    type: { type: String, default: "Point" }, // GeoJSON Point type
    coordinates: [Number], // Array of [longitude, latitude]
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
      type: String,
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

placeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Places", placeSchema);
