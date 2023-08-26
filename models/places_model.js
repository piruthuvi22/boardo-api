const mongoose = require("mongoose");
// const Double = require("@mongoosejs/double");

// require("mongoose-double")(mongoose);
// var SchemaTypes = mongoose.Schema.Types;

const PlaceSchema = mongoose.Schema({
  PlaceTitle: {
    type: String,
  },
  PlaceDescription: {
    type: String,
  },
  ImageUrl: {
    type: String,
  },
  Rating: {
    type: String,
  },
  Coordinates: {
    Latitude: {
      type: String,
    },
    Longitude: {
      type: String,
    },
  },
  Facilities: {
    RoomType: {
      type: String,
    },
    NoOfBeds: {
      type: Number,
    },
    WashRoomType: {
      type: Array,
    },
    OfferingMeals: {
      type: Boolean,
      default: false,
    },
    Facilities: {
      type: Array,
    },
    Payment: {
      type: String,
      default: "Monthly",
    },
  },
  Cost: {
    type: String,
  },
  status: {
    type: String,
    default: "AVAILABLE", // AVAILABLE, RESERVED, BLOCKED
  },
});

module.exports = mongoose.model("Places", PlaceSchema);
