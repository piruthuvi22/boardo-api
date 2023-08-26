const express = require("express");
const Router = express.Router();

const Reservation = require("../models/reservation_model");
const Place = require("../models/places_model");

Router.get("/", (req, res) => {
  res.send("Reservations");
});

Router.post("/new", async (req, res) => {
  let { UserId, PlaceId } = req.body;

  try {
    //  check if place exists
    const place = await Place.findById(PlaceId);
    if (!place) return res.status(400).json({ msg: "Place does not exist." });

    // check if place is available
    if (place.status !== "AVAILABLE")
      return res.status(400).json({ msg: "Place is not available." });
   
      // create new reservation
    const newReservation = new Reservation({
      UserId,
      PlaceId,
    });
    // save reservation
    const reservation = await newReservation.save();

    // update place status
    await Place.findByIdAndUpdate(PlaceId, { status: "RESERVED" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Router.post("/cancel/:reservationId", async (req, res) => {
  let { reservationId } = req.params.reservationId;

  try {
    // cancel reservation
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation)
      return res.status(400).json({ msg: "Reservation does not exist." });

    // update place status
    await Place.findByIdAndUpdate(reservation.PlaceId, { status: "AVAILABLE" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = Router;
