const express = require("express");
const Router = express.Router();

const Reservation = require("../models/reservation_model");
const Place = require("../models/places_model");
const User = require("../models/user_model");

Router.get("/", (req, res) => {
  res.send("Reservations");
});

Router.post("/new", async (req, res) => {
  let { UserEmail, PlaceId } = req.body;
  console.log("UserEmail", UserEmail, "PlaceId", PlaceId);
  try {
    //  check if place exists
    const place = await Place.findOne({ _id: PlaceId });

    if (!place) return res.status(400).json({ msg: "Place does not exist." });

    // check if place is available
    if (place.status !== "AVAILABLE")
      return res.status(400).json({ msg: "Place is not available." });

    // get user id
    const user = await User.findOne({ email: UserEmail });
    const UserId = user._id;
    // create new reservation
    const newReservation = new Reservation({
      UserId,
      PlaceId,
      Date: Date.now(),

    });
    // save reservation
    const reservation = await newReservation.save();

    // update place status

    await Place.findByIdAndUpdate(PlaceId, { status: "PENDING" });

    res.json(reservation);
  } catch (error) {
    res.status(500).json(error);
  }
});
Router.put("/accepted", async (req, res) => {
  const { PlaceId } = req.body;
  try {
    // update place status
    await Place.findByIdAndUpdate(PlaceId, { status: "RESERVED" });
    res.json({ msg: "Place accepted" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

Router.put("/rejected", async (req, res) => {
  const { PlaceId } = req.body;
  try {
    // update place status
    await Place.findByIdAndUpdate(PlaceId, { status: "AVAILABLE" });
    res.json({ msg: "Place rejected" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

Router.put("/available", async (req, res) => {
  const { PlaceId } = req.body;
  try {
    // update place status
    await Place.findByIdAndUpdate(PlaceId, { status: "AVAILABLE" });
    res.json({ msg: "Place available" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

Router.get("/getAvailableNotification", async (req, res) => {
  const { email, placeId } = req.query;
  try {
    const user = await User.findOne({ email: email });
    const userId = user._id;
    const reservation = await Reservation.findOne({
      UserId: userId,
      PlaceId: placeId,
    });
    if (reservation) {
      const place = await Place.findOne({ _id: reservation?.PlaceId });
      if (place.status === "RESERVED") {
        console.log(place.status, placeId);
        res.json(true);
      }
    }
    // res.json({ msg: "Reservation does not exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Router.post("/cancel", async (req, res) => {
  let { reservationId } = req.query;

  try {
    // cancel reservation
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation)
      return res.status(404).json({ msg: "Reservation does not exist." });

    // update place status
    await Place.findByIdAndUpdate(reservation.PlaceId, { status: "AVAILABLE" });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = Router;
