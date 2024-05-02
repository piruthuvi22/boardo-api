const express = require("express");
const Router = express.Router();

const WishList = require("../models/wishlist_model");
const Places = require("../models/places_model");

Router.get("/", (req, res) => {
  res.send("WishList ");
});

//http://192.168.8.139:1000/wish-list/get-status
Router.get("/get-wishlist/:userEmail", async (req, res) => {
  let userEmail = req.params.userEmail; // User id should be passed as a query parameter.
  console.log(userEmail);
  WishList.findOne({ email: userEmail }, async (err, wishList) => {
    if (err) res.status(500).json("Fetch wishlist error");
    else {
      // console.log("get-wishlist", wishList);
      if (wishList.length == 0) {
        res.status(404).json("No wishlist found");
      } else {
        // Fetch places from places collection based on the place ids in the wishlist collection
        let places = [];
        for (const placeId of wishList[0].placeIds) {
          try {
            let docs = await Places.find({ _id: placeId });
            places.push(docs[0]);
          } catch (error) {
            res.status(500).json("Fetch wishlist error");
          }
        }

        if (places.length != 0) {
          // console.log("places");
          res.status(200).json(places);
        }
      }
    }
  });
});

//http://192.168.8.139:1000/wish-list/get-status
Router.get("/get-status", async (req, res) => {
  let userEmail = req.query.userEmail || "piruthuvi22@gmail.com"; // User id should be passed as a query parameter.
  let placeId = req.query.placeId || "placeId"; // placeId should be passed as a query parameter.

  let isExists = await WishList.findOne({
    email: userEmail,
    placeIds: { $in: [placeId] },
  });
  if (isExists) {
    res.status(200).json(true);
  } else {
    res.status(200).json(false);
  }
});

//http://192.168.8.139:1000/wish-list/add-to-wish
Router.post("/add-remove-wishlist", async (req, res) => {
  // console.log(req.body);
  let userEmail = req.body.userEmail || "piruthuvi22@gmail.com"; // User id should be passed as a query parameter.
  let placeId = req.body.placeId || "placeId"; // placeId should be passed as a query parameter.

  // Find the wishlist of the user
  let wishListOfUser = await WishList.findOne({ email: userEmail });
  // If wishlist of user is not exists, then create a new wishlist
  if (!wishListOfUser) {
    let newWish = new WishList({
      placeIds: [placeId],
      email: userEmail,
    });
    newWish.save((err, doc) => {
      if (err) res.status(500).json(false);
      res.status(200).json(true);
    });
  }
  // If wishlist of user is exists, then check whether the place is already in the wishlist
  else {
    let isPlaceExists = wishListOfUser.placeIds.includes(placeId);
    // If place is not exists in the wishlist, then add the place to the wishlist
    if (!isPlaceExists) {
      wishListOfUser.placeIds.push(placeId);
      wishListOfUser.save((err, doc) => {
        if (err) res.status(500).json(false);
        res.status(200).json(true);
      });
    }
    // If place is exists in the wishlist, then remove the place from the wishlist
    else {
      // if the place is the only place in the wishlist, then remove the document
      if (wishListOfUser.placeIds.length == 1) {
        wishListOfUser.deleteOne((err, doc) => {
          if (err) res.status(500).json(false);
          res.status(200).json(true);
        });
      } else {
        let index = wishListOfUser.placeIds.indexOf(placeId);
        wishListOfUser.placeIds.splice(index, 1);
        wishListOfUser.save((err, doc) => {
          if (err) res.status(500).json(false);
          res.status(200).json(true);
        });
      }
    }
  }
});

module.exports = Router;
