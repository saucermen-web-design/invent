// REQUIRED MODULES  
  require('dotenv').config()
  const express = require("express");
  const app = express();
  const methodOverride = require("method-override");
// PROCCESS .ENV FILE
  const PORT = process.env.PORT || 3000;
  const MONGODB_URI = process.env.MONGODB_URI;

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
  app.set('view engine', 'ejs');

// Connect mongoose to mongo db:
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.once("open", () => {
    console.log("connected to mongo");
  });

  const itemsController = require("./controllers/items.js");
// any routes that come in for items should be sent
// to the fruitsContoller
  app.use("/items", itemsController);


  app.get("/", (req, res) => {
    res.redirect("/items");
  });

// wildcard route
  app.get("*", (req, res) => {
    res.redirect("/items");
  });

// Web server:
  app.listen(PORT, () => {
    console.log("listening");
  });
