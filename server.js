  require('dotenv').config()

  const express = require("express");
  const app = express();
  const methodOverride = require("method-override");

  const PORT = process.env.PORT || 3000
  const MONGODB_URI = process.env.MONGODB_URI

// Load up mongoose npm as mongoose:
  const mongoose = require("mongoose");
// allows server to review json data
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
// your own custom middleware
  app.use((req, res, next) => {
    console.log("my own middleware");
    next();
  });

// Connect mongoose to mongo db:
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.once("open", () => {
    console.log("connected to mongo");
  });

  const fruitsController = require("./controllers/fruits.js");
// any routes that come in for fruits should be sent
// to the fruitsContoller
  app.use("/fruits", fruitsController);

  app.get("/", (req, res) => {
    res.redirect("/fruits");
  });

// wildcard route
  app.get("*", (req, res) => {
    res.redirect("/fruits");
  });

// Web server:
  app.listen(PORT, () => {
    console.log("listening");
  });
