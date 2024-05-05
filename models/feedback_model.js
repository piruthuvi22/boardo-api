const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

module.exports = mongoose.model("Feedback", feedbackSchema);
