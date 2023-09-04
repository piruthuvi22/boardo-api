const express = require("express");
const Router = express.Router();

const WishList = require("../models/wishlist_model");
const Places = require("../models/places_model");

Router.get("/", (req, res) => {
  res.send("WishList ");
});

//http://192.168.8.139:1000/wish-list/get-status
Router.get("/get-wishlist", async (req, res) => {
  let userId = req.query.userEmail; // User id should be passed as a query parameter.
  console.log(userId);
  WishList.find({ UserId: userId }, async (err, wishList) => {
    if (err) res.status(500).json("Fetch wishlist error");
    else {
      // console.log("get-wishlist", wishList);
      if (wishList.length == 0) {
        res.status(404).json({ message: "No wishlist found" });
      } else {
        // Fetch places from places collection based on the place ids in the wishlist collection
        let places = [];
        for (const placeId of wishList[0].PlaceIds) {
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
  let userId = req.query.userEmail || "user1"; // User id should be passed as a query parameter.
  let placeId = req.query.placeId || "placeId"; // placeId should be passed as a query parameter.

  let isExists = await WishList.findOne({
    UserId: userId,
    PlaceIds: { $in: [placeId] },
  });
  if (isExists) {
    res.status(200).json({ status: true });
  } else {
    res.status(200).json({ status: false });
  }
});

//http://192.168.8.139:1000/wish-list/add-to-wish
Router.post("/add-remove-wishlist", async (req, res) => {
  // console.log(req.body);
  let userId = req.body.userEmail || "user1"; // User id should be passed as a query parameter.
  let placeId = req.body.placeId || "placeId"; // placeId should be passed as a query parameter.

  // Find the wishlist of the user
  let wishListOfUser = await WishList.findOne({ UserId: userId });
  // If wishlist of user is not exists, then create a new wishlist
  if (!wishListOfUser) {
    let newWish = new WishList({
      PlaceIds: [placeId],
      UserId: userId,
    });
    newWish.save((err, doc) => {
      if (err) res.status(500).json(placeId + "Wishlist add error");
      res
        .status(200)
        .json({ msg: placeId + " Added to wish list", status: "added" });
    });
  }
  // If wishlist of user is exists, then check whether the place is already in the wishlist
  else {
    let isPlaceExists = wishListOfUser.PlaceIds.includes(placeId);
    // If place is not exists in the wishlist, then add the place to the wishlist
    if (!isPlaceExists) {
      wishListOfUser.PlaceIds.push(placeId);
      wishListOfUser.save((err, doc) => {
        if (err) res.status(500).json(placeId + "Wishlist add error");
        res
          .status(200)
          .json({ msg: placeId + " Added to wish list", status: "added" });
      });
    }
    // If place is exists in the wishlist, then remove the place from the wishlist
    else {
      // if the place is the only place in the wishlist, then remove the document
      if (wishListOfUser.PlaceIds.length == 1) {
        wishListOfUser.deleteOne((err, doc) => {
          if (err) res.status(500).json(placeId + "Wishlist remove error");
          res.status(200).json({ msg: " Doc removed", status: "removed" });
        });
      } else {
        let index = wishListOfUser.PlaceIds.indexOf(placeId);
        wishListOfUser.PlaceIds.splice(index, 1);
        wishListOfUser.save((err, doc) => {
          if (err) res.status(500).json(placeId + "Wishlist remove error");
          res
            .status(200)
            .json({ msg: " Removed from wish list", status: "removed" });
        });
      }
    }
  }
});

module.exports = Router;
