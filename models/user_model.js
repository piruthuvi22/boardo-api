const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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

module.exports = mongoose.model("User", userSchema);
