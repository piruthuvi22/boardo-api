const mongoose = require("mongoose");

module.exports = mongoose.model("WishList", {
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
