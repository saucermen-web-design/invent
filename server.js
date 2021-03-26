// REQUIRED MODULES  
const express = require("express");
const app = express();
const methodOverride = require("method-override");
// const morgan = require('morgan');
const session = require('express-session');
const favicon = require('serve-favicon');
const path = require('path');
const MongoStore = require('connect-mongo');
require('dotenv').config()

  // PROCCESS .ENV FILE
  const PORT = process.env.PORT || 3001;
  const MONGODB_URI = process.env.MONGODB_URI;

// Load up mongoose
  const mongoose = require("mongoose");
  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride("_method"));
  app.use(express.static('public'));
  // app.use(morgan('dev'));

// Middleware
  app.use((req, res, next) => {
    // console.log("my own middleware");
    next();
  });
  
  app.use(favicon(path.join(__dirname,'public','images','inventIcon.png')));

  app.use(function(req, res, next) {
    req.date = new Date().toLocaleDateString();
    req.time = new Date().toLocaleTimeString();
    next();
  });

  app.use(session({
    cookie:{
        secure: true,
        maxAge:60000
           },
    store: MongoStore.create({ client: MONGODB_URI, clientPromise,
      dbName: 'projectWeek2'}), 
    secret: 'supersecret',
    saveUninitialized: true,
    resave: false
    }));

// Connect mongoose to mongo db:
  mongoose.connect(toString(MONGODB_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.once("open", () => {
    // console.log("connected to mongo");
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
    res.redirect("users/login");
  });

// wildcard route
  app.get("*", (req, res) => {
      res.redirect("/");
  });

// HOW MANY TIMES VISITIED
  app.get('/times-visited', function(req, res) {
    if(req.session.visits) {
        req.session.visits++;
    } else {
        req.session.visits = 1;
    };
    res.send(`<h1>You've visited this page ${req.session.visits} time(s) </h1>`);
});

// Web server:
  app.listen(PORT, () => {
    // console.log("listening");
  });
