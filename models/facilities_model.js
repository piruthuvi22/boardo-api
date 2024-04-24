const mongoose = require("mongoose");

module.exports = mongoose.model("Facilities", {
  name: {
    type: String,
  },
});
