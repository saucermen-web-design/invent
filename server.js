// REQUIRED MODULES  
  require('dotenv').config()
  const express = require("express");
  const app = express();
  const methodOverride = require("method-override");
  const morgan = require('morgan');
  const session = require('express-session');

  // PROCCESS .ENV FILE
  const PORT = process.env.PORT || 3000;
  const MONGODB_URI = process.env.MONGODB_URI;

// Load up mongoose npm as mongoose:
  const mongoose = require("mongoose");
// allows server to review json data
  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride("_method"));
  app.use(express.static('public'));
  app.use(morgan('dev'));
// your own custom middleware
  app.use((req, res, next) => {
    console.log("my own middleware");
    next();
  });

  app.use(function(req, res, next) {
    req.date = new Date().toLocaleDateString();
    req.time = new Date().toLocaleTimeString();
    next();
  });

  app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
  }));

// Connect mongoose to mongo db:
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.once("open", () => {
    console.log("connected to mongo");
  });

// CONTROLLERS
  const itemsController = require("./controllers/items");
  app.use("/items", itemsController);
  const usersController = require("./controllers/users");
  app.use("/users", usersController);

// SET VIEW ENGINE 
  app.set('view engine', 'ejs');

// ROUTING
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
