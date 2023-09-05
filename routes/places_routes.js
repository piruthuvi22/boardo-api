const express = require("express");
const geolib = require("geolib");

const Router = express.Router();

const Places = require("../models/places_model");
const Users = require("../models/user_model");

Router.get("/", async (req, res) => {
  res.send("User ");
});
Router.get("/get-uploaded-places", async (req, res) => {
  console.log(req.query);
  const email = req.query.email;
  const user = await Users.findOne({ email });
  if (!user) {
    res.status(404).json("Account not found");
  }
  const places = await Places.find({ LandlordId: user?._id });
  res.status(200).json(places);
});
//http://192.168.8.139:1000/places/add-place
Router.post("/add-place", async (req, res) => {
  const bodyData = req.body;

  const user = await Users.findOne({ email: bodyData?.LandlordEmail });

  let newPlace = new Places({
    LandlordId: user?._id,
    PlaceTitle: bodyData?.PlaceTitle,
    PlaceDescription: bodyData?.PlaceDescription,
    ImageUrl: bodyData?.ImageUrl,
    Rating: "4.2",
    Coordinates: {
      Latitude: bodyData?.Coordinates?.latitude,
      Longitude: bodyData?.Coordinates?.longitude,
    },
    Facilities: {
      RoomType: bodyData?.Facilities?.RoomType,
      NoOfBeds: bodyData?.Facilities?.NoOfBeds,
      WashRoomType: bodyData?.Facilities?.WashRoomType,
      OfferingMeals: bodyData?.Facilities?.OfferingMeals,
      Facilities: bodyData?.Facilities?.Facilities,
      Payment: bodyData?.Facilities?.Payment,
    },
    Cost: bodyData?.Cost,
  });
  newPlace.save((err, doc) => {
    if (err) res.status(500).json("Place save error");
    res.status(200).json({ "Place saved": doc });
  });
});

//http://192.168.8.139:1000/places/get-places
Router.get("/get-places", async (req, res) => {
  let baseCoord = req.query.location;
  // baseCoord = { latitude: "6.796764", longitude: "79.8996582" };
  // console.log("baseCoord", baseCoord);
  Places.find(async (err, docs) => {
    if (err) {
      res.status(500).json("Fetching places error");
    } else {
      if (docs.length == 0) {
        res.status(404).json({ message: "No places found" });
      } else {
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

        // get distance
        let distanceArray = [];
        response.map((res) => {
          distanceArray.push({
            title: res.PlaceTitle,
            distance: geolib.getDistance(
              baseCoord,
              {
                latitude: res.Coordinates.Latitude,
                longitude: res.Coordinates.Longitude,
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
  Places.find({ PlaceId: req.params.id }, (err, docs) => {
    if (err) res.status(500).json("get place error");
    console.log("place get");
    res.status(200).json(docs);
  });
});

module.exports = Router;
