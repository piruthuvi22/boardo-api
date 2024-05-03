const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
  email: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  province: {
    type: String,
  },
  district: {
    type: String,
  },
  userRole: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
});
