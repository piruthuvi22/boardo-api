const express = require("express");
const Router = express.Router();

const User = require("../models/user_model");

Router.get("/", (req, res) => {
  res.send("User ");
});
//http://192.168.8.139:1000/users/register
Router.post("/register", async (req, res) => {
  const bodyData = req.body;
  let userData = await User.findOne({ Username: bodyData.username });
  if (!userData) {
    const user = new User({
      Username: bodyData.username,
      Password: bodyData.password,
    });

    user.save((err, doc) => {
      if (err) {
        res.json(err);
      }
      console.log("Saved");
      res.status(200).json(doc);
    });
  } else {
    res.json("Account already exists");
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
