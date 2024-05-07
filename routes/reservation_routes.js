const express = require("express");
const Router = express.Router();

const Reservation = require("../models/reservation_model");
const Place = require("../models/places_model");
const User = require("../models/user_model");
const dateFormatter = require("../utils/date_formatter");

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

Router.get("/get-reservation/:adminId", async (req, res) => {
  const adminId = req.params?.adminId;
  try {
    const reservation = await Reservation.find({ adminId: adminId });
    if (reservation.length === 0)
      return res.status(404).json("Reservation does not exist.");

    if (reservation.length > 0) {
      let responseArray = [];
      for (let i = 0; i < reservation.length; i++) {
        const place = await Place.findOne({ _id: reservation[i]?.placeId });
        if (!place) return res.status(404).json("Place does not exist.");

        const admin = await User.findOne({ _id: reservation[i]?.adminId });
        if (!admin) return res.status(404).json("Admin does not exist.");

        const student = await User.findOne({ _id: reservation[i]?.userId });
        if (!student) return res.status(404).json("Student does not exist.");

        const formatedRequestedTime = dateFormatter(reservation[i]?.timestamp);
        const formattedCheckInTime = dateFormatter(reservation[i]?.checkIn);
        const formattedCheckOutTime = dateFormatter(reservation[i]?.checkOut);

        const response = {
          _id: reservation[i]?._id,
          placeName: place?.name,
          placeUrl: place.imageUrls[0].url,
          studentName: student?.firstName + " " + student?.lastName,
          studentNumber: student?.phoneNumber,
          adminName: admin?.firstName + " " + admin?.lastName,
          checkIn: formattedCheckInTime,
          checkOut: formattedCheckOutTime,
          message: reservation[i]?.message,
          noOfGuests: reservation[i]?.noOfGuests,
          status: reservation[i]?.status,
          timestamp: formatedRequestedTime,
        };
        responseArray.push(response);
      }
      res.json(responseArray);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

Router.put("/update-status/:reservationId", async (req, res) => {
  const reservationId = req.params.reservationId;
  const { status } = req.body;
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true }
    );
    if (!reservation)
      return res.status(404).json("Reservation does not exist.");
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = Router;
