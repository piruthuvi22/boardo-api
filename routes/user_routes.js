const express = require("express");
const Router = express.Router();

const User = require("../models/user_model");

Router.get("/", (req, res) => {
  res.send("User ");
});
//http://192.168.8.139:1000/users/register
Router.post("/register", async (req, res) => {
  console.log("Hello");
  const bodyData = req.body;
  console.log("bodyData:", bodyData);

  const user = new User({
    email: bodyData.email,
    displayName: bodyData.displayName,
    userRole: bodyData.userRole,
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

//http://192.168.8.139:1000/users/login
Router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  let userData = await User.findOne({ Username: username });
  if (userData) {
    if (userData.Username == username && userData.Password == password) {
      res.status(200).json("Login success");
    } else {
      res.status(400).json("Login failed");
    }
  } else {
    res.status(404).json("Account not found");
  }
});
module.exports = Router;
