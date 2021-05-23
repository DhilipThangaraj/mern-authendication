const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/**
 * @summary - connect to db
 * @param {Function} mongoose.connect - This method helps to connect to db which take two params.
 * @param {string} url - which comes from .env
 * @param {Object}
 * @param {property} useNewUrlParser - which helps to avoid the deprecated warning.
 * @param {property} useFindAndModify - which helps to avoid the deprecated warning.
 * @param {property} useUnifiedTopology - which helps to avoid the deprecated warning.
 * @param {property} useCreateIndex - which helps to avoid the deprecated warning.
 * @returns {Promise}
 */

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("########DB Connected###########");
  })
  .catch((err) => {
    console.log("*********DB connection error*****************", err);
  });

//Import routes
const authRoutes = require("./routes/auth");

//app middlewares - which gives response in parsed manner.
app.use(morgan("dev"));

//Cors will allow any other origin.
//app.use(cors());
//bodyParser helps to parse the json data that received from the client.

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:3000" }));
}

//Applying middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;

//Listening port
app.listen(port, () => {
  console.log(`API is running on ${port}`);
});
