const express = require("express");
const Router = express.Router();

const User = require("../models/user_model");

Router.get("/", (req, res) => {
  res.send("User ");
});
//http://192.168.8.139:1000/users/register
Router.post("/register", async (req, res) => {
  const bodyData = req.body;
  console.log("bodyData:", bodyData);

  const user = new User({
    email: bodyData?.email,
    userRole: bodyData?.userRole,
  });

  user.save((err, doc) => {
    if (err) {
      res.json(err);
    }
    console.log("Saved");
    res.status(200).json(doc);
  });
});
Router.put("/updateDisplayName", async (req, res) => {
  const { email, displayName, phoneNumber } = req.body;
  const user = await User.findOne({ email: email });
  console.log(user);
  if (user) {
    user.displayName = displayName;
    user.phoneNumber = phoneNumber;
    user.save();
    res.status(200).json("Update success");
  } else {
    res.status(404).json("Account not found");
  }
});

//http://192.168.8.139:1000/users/getUserRole
Router.get("/getUserRole", async (req, res) => {
  const email = req.query.email;
  console.log("email:", email);
  let userData = await User.findOne({ email: email });
  console.log(userData);
  if (userData) {
    res.status(200).json(userData?.userRole);
  } else {
    res.status(404).json("Account not found");
  }
});
module.exports = Router;
