const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  Username: {
    type: String,
  },
  Password: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
