const mongoose = require("mongoose");

module.exports = mongoose.model("Feedback", {
  email: {
    type: String,
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Places",
  },
  userName: {
    type: String,
  },
  userImage: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  rating: {
    type: Number,
  },
  comment: {
    type: String,
  },
});
