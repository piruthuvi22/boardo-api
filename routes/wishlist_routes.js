const express = require("express");
const Router = express.Router();

const WishList = require("../models/wishlist_model");

Router.get("/", (req, res) => {
  res.send("WishList ");
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
Router.post("/add-to-wish", async (req, res) => {
  const bodyData = req.body;
  let isExists = await WishList.findOne({ PlaceId: bodyData.id });
  if (!isExists) {
    let newWish = new WishList({
      PlaceId: bodyData.id,
    });
    newWish.save((err, doc) => {
      if (err) res.status(500).json("Place save error");
      res.status(200).json({ msg: " Added to wish list", status: "added" });
    });
  } else {
    let deletedDoc = await WishList.findOneAndDelete({ PlaceId: bodyData.id });
    deletedDoc
      ? res
          .status(200)
          .json({ msg: " Place removed from wishlist", status: "removed" })
      : res.status(500).json(bodyData.id + "Place remove error");
  }
});

module.exports = Router;
