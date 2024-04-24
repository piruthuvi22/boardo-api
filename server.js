const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
const cors = require("cors");
const users = require("./routes/user_routes");
const places = require("./routes/places_routes");
const wishlist = require("./routes/wishlist_routes");
const reservation = require("./routes/reservation_routes");
const places_model = require("./models/places_model");

require("dotenv").config();
const uri = process.env.MONGO_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", users);
app.use("/api/places", places);
app.use("/api/wish-list", wishlist);
app.use("/api/reservation", reservation);

let connection = mongoose.connect(uri, {
  dbName: "boardo",
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.send(`<h1>API listing on ${process.env.PORT}</h1>`);
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
