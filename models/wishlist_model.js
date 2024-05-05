const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  email: {
    type: mongoose.Schema.Types.String,
    ref: "Users",
  },
  placeIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Places",
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
