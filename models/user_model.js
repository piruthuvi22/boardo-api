const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
module.exports = mongoose.model("User", userSchema);
