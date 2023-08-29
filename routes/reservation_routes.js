const express = require("express");
const Router = express.Router();

const Reservation = require("../models/reservation_model");
const Place = require("../models/places_model");

Router.get("/", (req, res) => {
  res.send("Reservations");
});

// Get reservations by user id
Router.get("/get-reservation", async (req, res) => {
  let { userId } = req.query;
  try {
    const reservations = await Reservation.find({ UserId: userId });
    console.log("*");
    if (reservations.length === 0) {
      console.log("**");
      return res.status(404).json("No reservations found");
    } else {
      console.log("***");
      try {
        let place = await Place.findById(reservations[0].PlaceId);
        return res.status(200).json(place);
      } catch (error) {
        console.log("****");
        res.status(500).json(error);
      }
    }
  } catch (error) {
    console.log("****");
    res.status(500).json(error);
  }
});

Router.post("/add-reservation", async (req, res) => {
  let { userId, placeId } = req.body;

  try {
    //  check if place exists
    const place = await Place.findById(placeId);
    if (!place) return res.status(400).json({ msg: "Place does not exist." });

    // check if place is available
    if (place.status !== "AVAILABLE")
      return res.status(400).json({ msg: "Place is not available." });

    // create new reservation
    const newReservation = new Reservation({
      userId,
      placeId,
    });
    // save reservation
    const reservation = await newReservation.save();

    // update place status
    await Place.findByIdAndUpdate(placeId, { status: "RESERVED" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json(error);
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
