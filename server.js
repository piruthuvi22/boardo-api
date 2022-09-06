const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/user_routes");
const places = require("./routes/places_routes");
const wishlist = require("./routes/wishlist_routes");

require("dotenv").config();
const uri = process.env.MONGO_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", users);
app.use("/places", places);
app.use("/wish-list", wishlist);

let connection = mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.send("Backend(v2) working on" + process.env.PORT);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 1000}`);
  connection
    .then(() => {
      console.log("Database connection established");
    })
    .catch((err) => {
      console.log("Database connection failed", err);
    });
});
