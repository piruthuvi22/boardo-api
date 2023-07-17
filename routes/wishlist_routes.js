const express = require("express");
const Router = express.Router();

const WishList = require("../models/wishlist_model");

Router.get("/", (req, res) => {
  res.send("WishList ");
});

//http://192.168.8.139:1000/wish-list/get-status
Router.get("/get-wishlist", async (req, res) => {
  WishList.find({}, (err, docs) => {
    if (err) res.status(500).json(err);
    console.log("get-wishlist");
    res.status(200).json(docs);
  });
});

//http://192.168.8.139:1000/wish-list/get-status
Router.get("/get-status/:_id", async (req, res) => {
  let isExists = await WishList.findOne({ PlaceId: req.params._id });
  if (isExists) {
    res.status(200).json({ status: true });
  } else {
    res.status(200).json({ status: false });
  }
});

//http://192.168.8.139:1000/wish-list/add-to-wish
Router.post("/add-remove-wishlist/:id", async (req, res) => {
  const placeId = req.params.id;
  let isExists = await WishList.findOne({ PlaceId: placeId });
  if (!isExists) {
    let newWish = new WishList({
      PlaceId: placeId,
    });
    newWish.save((err, doc) => {
      if (err) res.status(500).json(placeId + "Place save error");
      res.status(200).json({ msg: " Added to wish list", status: "added" });
    });
  } else {
    let deletedDoc = await WishList.findOneAndDelete({ PlaceId: placeId });
    deletedDoc
      ? res
          .status(200)
          .json({ msg: " Place removed from wishlist", status: "removed" })
      : res.status(500).json(placeId + "Place remove error");
  }
});

module.exports = Router;
