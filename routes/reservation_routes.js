const express = require("express");
const Router = express.Router();

const Reservation = require("../models/reservation_model");
const Place = require("../models/places_model");
const User = require("../models/user_model");

Router.get("/", (req, res) => {
  res.send("Reservations");
});

Router.post("/new-reservation", async (req, res) => {
  let { userId, placeId, adminId, checkIn, checkOut, noOfGuests, message } =
    req.body;
  // console.log(req.body);
  try {
    //  check if place exists
    const place = await Place.findOne({ _id: placeId });
    if (!place) return res.status(400).json("Place does not exist.");

    // check if place is available
    // if (place.status !== "AVAILABLE")
    //   return res.status(400).json("Place is not available.");

    const existingReservations = await Reservation.find({
      placeId: placeId,
      status: "ACCEPTED",
      $and: [
        {
          checkIn: { $lte: checkOut },
        },
        {
          checkOut: { $gte: checkIn },
        },
      ],
    });

    if (existingReservations.length > 0) {
      return res
        .status(400)
        .json("Place is not available for the selected dates.");
    }

    // create new reservation
    const newReservation = new Reservation({
      userId,
      adminId,
      placeId,
      checkIn,
      checkOut,
      noOfGuests,
      message,
    });
    // save reservation
    const reservation = await newReservation.save();

    // update place status
    // await Place.findByIdAndUpdate(placeId, { status: "PENDING" });

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET reservations of place
Router.get("/get-reservations/place/:placeId", async (req, res) => {
  const placeId = req.params.placeId;
  try {
    const reservations = await Reservation.find({
      placeId,
      status: "ACCEPTED",
    }).select("-__v -userId -noOfGuests -message -status -timestamp");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json(error);
  }
});

Router.get("/get-reservations/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    // Find all reservations of the user from Reservation entity and include the place name and image from Place entit in the response
    const reservations = await Reservation.find({ userId })
      .populate("placeId", "name imageUrls rating cost", Place)
      .select("-__v -adminId");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json(error);
  }
});

Router.put("/accepted", async (req, res) => {
  const { placeId } = req.body;
  try {
    // update place status
    await Place.findByIdAndUpdate(placeId, { status: "RESERVED" });
    res.json("Place accepted");
  } catch (error) {
    res.json(error.message);
  }
});

Router.put("/rejected", async (req, res) => {
  const { placeId } = req.body;
  try {
    // update place status
    await Place.findByIdAndUpdate(placeId, { status: "AVAILABLE" });
    res.json("Place rejected");
  } catch (error) {
    res.json(error.message);
  }
});

Router.put("/available", async (req, res) => {
  const { placeId } = req.body;
  try {
    // update place status
    await Place.findByIdAndUpdate(placeId, { status: "AVAILABLE" });
    res.json("Place available");
  } catch (error) {
    res.json(error.message);
  }
});

Router.get("/getAvailableNotification", async (req, res) => {
  const userEmail = req.query?.email;
  const placeId = req.query?.placeId;
  try {
    const user = await User.findOne({ email: userEmail });
    const userId = user._id;
    const reservation = await Reservation.findOne({
      userId,
      placeId,
    });
    if (!reservation) return res.json(false);
    if (reservation) {
      const place = await Place.findOne({ _id: reservation?.placeId });

      if (place.status === "RESERVED") {
        console.log("getAvailableNotification:", place.status, placeId);
        res.json(true);
      } else {
        res.json(false);
      }
    }
    // res.json({ msg: "Reservation does not exist" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

Router.post("/cancel", async (req, res) => {
  let { reservationId } = req.query;

  try {
    // cancel reservation
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation)
      return res.status(404).json("Reservation does not exist.");

    // update place status
    await Place.findByIdAndUpdate(reservation.placeId, { status: "AVAILABLE" });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = Router;
