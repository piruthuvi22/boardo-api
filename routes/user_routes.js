const express = require("express");
const Router = express.Router();

const User = require("../models/user_model");
const Places = require("../models/places_model");
const Reservations = require("../models/reservation_model");

Router.get("/", (req, res) => {
  res.send("User ");
});
//http://192.168.8.139:1000/users/register
Router.post("/register", async (req, res) => {
  const bodyData = req.body;
  const { email, firstName, lastName, userRole } = bodyData;

  const existingUser = await User.findOne({ email: email, userRole: userRole });
  if (existingUser) {
    return res.status(200).json(existingUser);
  }

  const user = new User({
    email,
    firstName,
    lastName,
    userRole,
  });

  user.save((err, doc) => {
    if (err) {
      res.json(err);
    }
    res.status(200).json(doc);
  });
});
Router.put("/update-profile", async (req, res) => {
  const { email, firstName, lastName, phoneNumber, province, district } =
    req.body;
  const user = await User.findOne({ email: email });

  if (user == null) {
    return res.status(404).send(false);
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.phoneNumber = phoneNumber;
  user.province = province;
  user.district = district;

  user.save().then((doc) => {
    res.status(200).json(doc);
  });
});

Router.get("/get-contact-number", async (req, res) => {
  const email = req.query?.email;
  const user = await User.findOne({ email });
  if (user) {
    res.status(200).json(user?.phoneNumber);
  } else {
    res.json("Account not found");
  }
});

//http://192.168.8.139:1000/users/getUserRole
Router.get("/get-user-role", async (req, res) => {
  const email = req.query.email;
  let userData = await User.findOne({ email: email });
  if (userData) {
    res.status(200).json(userData?.userRole);
  } else {
    res.status(404).json("Account not found");
  }
});

Router.get("/get-admin", async (req, res) => {
  try {
    const placeId = req.query?.placeId;
    const place = await Places?.findOne({ _id: placeId });
    const llDetails = await User.findOne({ _id: place?.userId });
    res.status(200).json(llDetails);
  } catch (err) {
    res.status(500).json(err);
  }
});
Router.get("/get-student-by-placeId", async (req, res) => {
  try {
    const placeId = req.query?.placeId;

    const reservation = await Reservations.findOne({ placeId });

    const studentId = reservation?.userId;
    const studentDetails = await User.findOne({ _id: studentId });

    res.status(200).json(studentDetails);
  } catch (err) {
    res.status(500).json(err);
  }
});

Router.get("/get-user-by-email/:email/:userRole", async (req, res) => {
  const email = req.params.email;
  const userRole = req.params.userRole;

  const user = await User.findOne({ email: email, userRole: userRole });
  if (user) {
    res.status(200).json(user);
  }
});
module.exports = Router;
