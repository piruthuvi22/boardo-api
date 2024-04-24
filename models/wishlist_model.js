const mongoose = require("mongoose");

module.exports = mongoose.model("WishList", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  placeIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Places",
    },
  ],
});
