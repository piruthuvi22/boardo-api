const express = require("express");
const Router = express.Router();

const Places = require("../models/places_model");

Router.get("/", (req, res) => {
  res.send("User ");
});
//http://192.168.8.139:1000/places/add-place
Router.post("/add-place", async (req, res) => {
  const bodyData = req.body;
  let newPlace = new Places({
    PlaceTitle: "PlaceTitle1",
    PlaceDescription: "PlaceDescription1",
    Image: "Image1",
    Rating: "4.2",
    Coordinates: {
      Latitude: 111,
      Longtitude: 222,
    },
    Facilities: {
      RoomType: "Single",
      NoOfBeds: 4,
      WashRoomType: ["Traditional"],
      OfferingMeals: false,
      Facilities: ["fan", "ac"],
      Payment: "Monthly",
    },
    Cost: 6000,
  });
  // newPlace.save((err, doc) => {
  //   if (err) res.status(500).json("Place save error");
  //   res.status(200).json({ "Place saved": doc });
  // });
});

//http://192.168.8.139:1000/places/get-places
Router.get("/get-places", async (req, res) => {
  Places.find(
    {
      status: "AVAILABLE",
    },
    (err, docs) => {
      if (err) res.status(500).json("get places error");
      console.log("places get", docs.length);
      res.status(200).json(docs);
    }
  );
});

//http://192.168.8.139:1000/places/get-place/id
Router.get("/get-place/:id", async (req, res) => {
  Places.find({ PlaceId: req.params.id }, (err, docs) => {
    if (err) res.status(500).json("get place error");
    console.log("place get");
    res.status(200).json(docs);
  });
});

module.exports = Router;
