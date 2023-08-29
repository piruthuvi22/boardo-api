const mongoose = require("mongoose");

const wishList = mongoose.Schema({
  UserId: {
    type: String,
    default: "user1",
  },
  PlaceIds: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("WishList", wishList);
