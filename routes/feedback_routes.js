const express = require("express");
const Router = express.Router();
const Feedback = require("../models/feedback_model");
const Places = require("../models/places_model");

Router.get("/", (req, res) => {
  res.send("Feedback ");
});

Router.get("/get-feedback/place/:placeId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ placeId: req.params.placeId });
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, message: "Error finding feedback" });
  }
});

Router.get("/get-feedback/user/:userId/place/:placeId", async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      userId: req.params.userId,
      placeId: req.params.placeId,
    });
    res.status(200).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, message: "Error finding feedback" });
  }
});

Router.post("/create-feedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    const prevFeedback = await Feedback.find({ placeId: req.body.placeId });
    if (prevFeedback.length > 0) {
      const averageRating = prevFeedback.reduce(
        (acc, feedback) => acc + feedback.rating,
        0
      );
      const rating = averageRating / prevFeedback.length;
      await Places.findByIdAndUpdate(req.body.placeId, {
        rating: rating,
      });
    }

    res.status(200).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, message: "Error creating feedback" });
  }
});

Router.put("/update-feedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, message: "Error updating feedback" });
  }
});

Router.delete("/delete-feedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).send(true);
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, message: "Error deleting feedback" });
  }
});

module.exports = Router;
