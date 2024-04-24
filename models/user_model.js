const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
  email: {
    type: String,
  },
  displayName: {
    type: String,
  },
  userRole: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
});
