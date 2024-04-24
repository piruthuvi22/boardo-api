const express = require("express");
const geolib = require("geolib");

const Router = express.Router();

const Places = require("../models/places_model");
const Users = require("../models/user_model");

Router.get("/", async (req, res) => {
  res.send("Places ");
});
Router.get("/get-places/user", async (req, res) => {
  const email = req.query?.email;
  const user = await Users.findOne({ email });
  if (!user) {
    res.status(404).json("Account not found");
  }
  const places = await Places.find({ LandlordId: user?._id });
  res.status(200).json(places);
});
//http://192.168.8.139:1000/places/create-place
Router.post("/create-place", async (req, res) => {
  const bodyData = req.body;

  const user = await Users.findOne({ email: bodyData?.userEmail });

  let newPlace = new Places({
    userId: user?._id,
    name: bodyData?.name,
    description: bodyData?.description,
    imageUrls: bodyData?.imageUrls,
    rating: "4.2",
    coordinates: {
      latitude: bodyData?.coordinates?.latitude,
      longitude: bodyData?.coordinates?.longitude,
    },
    facilities: {
      roomType: bodyData?.facilities?.roomType,
      noOfBeds: bodyData?.facilities?.noOfBeds,
      washRoomType: bodyData?.facilities?.washRoomType,
      facilities: bodyData?.facilities?.facilities,
      paymentType: bodyData?.facilities?.paymentType,
    },
    cost: bodyData?.cost,
  });
  newPlace.save((err, doc) => {
    if (err) res.status(500).json("Place save error");
    res.status(200).json(doc);
  });
});

//http://192.168.8.139:1000/places/get-places
Router.get("/get-places", async (req, res) => {
  // let baseCoord = req.query;
  baseCoord = { latitude: "6.796764", longitude: "79.8996582" };
  Places.find(async (err, docs) => {
    if (err) {
      res.status(500).json("Fetching places error");
    } else {
      if (docs.length == 0) {
        res.status(404).json("No places found");
      } else {
        // let v = geolib.isPointWithinRadius(coord[1], base, 200);
        let orderd = geolib.orderByDistance(
          baseCoord,
          docs.map((doc) => doc.coordinates)
        );

        // let near = geolib.findNearest(base, coord);
        let response = [];
        orderd.map((coordinate) => {
          docs.map((doc) => {
            if (
              coordinate.latitude == doc.coordinates.latitude &&
              coordinate.longitude == doc.coordinates.longitude
            ) {
              response.push(doc);
            }
          });
        });

        // get distance
        let distanceArray = [];
        response.map((res) => {
          distanceArray.push({
            title: res.placeName,
            distance: geolib.getDistance(
              baseCoord,
              {
                latitude: res.coordinates.latitude,
                longitude: res.coordinates.longitude,
              },
              0.1
            ),
          });
        });

        res.status(200).json(response);
      }
    }
  });
});

//http://192.168.8.139:1000/places/get-places-ordered
Router.get("/get-places-ordered", async (req, res) => {
  // let baseCoord = req.params.coordinates;
  let baseCoord = { latitude: 6.7967488, longitude: 79.8996484 };

  Places.find(
    // {
    //   status: "AVAILABLE",
    // },
    async (err, docs) => {
      if (err) res.status(500).json("get places error");
      const coordinatesArray = docs.map((doc) => {
        return {
          latitude: doc.Coordinates.Latitude,
          longitude: doc.Coordinates.Longitude,
        };
      });

      // let v = geolib.isPointWithinRadius(coord[1], base, 200);
      let orderd = geolib.orderByDistance(baseCoord, coordinatesArray);
      // let near = geolib.findNearest(base, coord);

      let response = [];
      orderd.map((coordinate) => {
        docs.map((doc) => {
          if (
            coordinate.latitude == doc.Coordinates.Latitude &&
            coordinate.longitude == doc.Coordinates.Longitude
          ) {
            response.push(doc);
          }
        });
      });

      // console.log("places get", docs.length);
      res.status(200).json(docs);
    }
  );
});

//http://192.168.8.139:1000/places/get-place/id
Router.get("/get-place/:id", async (req, res) => {
  Places.findById(req.params.id, (err, docs) => {
    if (err) res.status(500).json("Get place error");
    res.status(200).json(docs);
  });
});

module.exports = Router;
