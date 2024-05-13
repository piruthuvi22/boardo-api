const express = require("express");
const geolib = require("geolib");

const Router = express.Router();

const Places = require("../models/places_model");
const Users = require("../models/user_model");

Router.get("/", async (req, res) => {
  res.send("Places ");
});
Router.get("/get-places/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await Users.findById(userId);
  if (!user) {
    res.status(404).json("Account not found");
  }
  const places = await Places.find({ userId: user?._id });
  res.status(200).json(places);
});

Router.get("/get-nearest-places", async (req, res) => {
  const {
    placeName,
    placeDescription,
    minBudget,
    maxBudget,
    rating,
    radius,
    paymentType,
    latitude,
    longitude,
    facility,
  } = req.query;

  let filter = {};

  if (minBudget && !isNaN(minBudget)) {
    filter.cost = {
      $gte: minBudget,
    };
  }
  if (maxBudget && !isNaN(maxBudget)) {
    filter.cost = {
      $lte: maxBudget,
    };
  }
  if (latitude && longitude) {
    filter.location = {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radius || 5000,
      },
    };
  }
  if (facility) filter.facilities.facilities = { $in: ["ac"] }; // Search for places with any of the facilities in the array
  if (rating && !isNaN(rating)) filter.rating = { $gte: rating };
  if (placeName) filter.name = new RegExp(placeName, "i");
  if (placeDescription) filter.description = new RegExp(placeDescription, "i");
  if (paymentType) filter.paymentType = new RegExp(paymentType, "i");

  Places.find(filter, (err, docs) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      if (docs.length == 0) {
        res.status(404).json("No places found");
      } else {
        res.status(200).json(docs);
      }
    }
  });
});

//http://192.168.8.139:1000/places/create-place
Router.post("/create-place", async (req, res) => {
  const bodyData = req.body;

  // const user = await Users.findOne({ email: bodyData?.userEmail });

  let id = req.body?.userId;
  let newPlace = new Places({
    // userId: user?._id,
    userId: id,
    name: bodyData?.name,
    description: bodyData?.description,

    address: bodyData?.address,
    imageUrls: bodyData?.imageUrls,
    rating: 0,
    location: {
      type: "Point",
      coordinates: [
        parseFloat(bodyData?.coordinates?.longitude),
        parseFloat(bodyData?.coordinates?.latitude),
      ],
    },
    coordinates: {
      latitude: bodyData?.coordinates?.latitude,
      longitude: bodyData?.coordinates?.longitude,
    },
    facilities: {
      roomType: bodyData?.facilities?.roomType,
      noOfBeds: bodyData?.facilities?.noOfBeds,
      washRoomType: bodyData?.facilities?.washRoomType,
      facilities: bodyData?.facilities?.facilities,
    },
    paymentType: bodyData?.facilities?.paymentType,
    cost: bodyData?.cost,
  });
  newPlace.save((err, doc) => {
    if (err) res.status(500).json("Place save error");
    res.status(200).json(doc);
  });
});

Router.put("/update-place/:id", async (req, res) => {
  const bodyData = req.body;
  Places.findByIdAndUpdate(
    req.params.id,
    {
      name: bodyData?.name,
      description: bodyData?.description,
      address: bodyData?.address,
      imageUrls: bodyData?.imageUrls,
      coordinates: {
        latitude: bodyData?.coordinates?.latitude,
        longitude: bodyData?.coordinates?.longitude,
      },
      facilities: {
        roomType: bodyData?.facilities?.roomType,
        noOfBeds: bodyData?.facilities?.noOfBeds,
        washRoomType: bodyData?.facilities?.washRoomType,
        facilities: bodyData?.facilities?.facilities,
      },
      paymentType: bodyData?.facilities?.paymentType,
      cost: bodyData?.cost,
    },
    (err, doc) => {
      if (err) res.status(500).json("Place update error");
      res.status(200).json(doc);
    }
  );
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
