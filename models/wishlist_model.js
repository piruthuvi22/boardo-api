const mongoose = require("mongoose");

const wishList = mongoose.Schema({
  PlaceId: {
    type: String,
  },
});

module.exports = mongoose.model("WishList", wishList);
