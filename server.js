// REQUIRED MODULES  
const express = require("express");
const app = express();
const methodOverride = require("method-override");
// const morgan = require('morgan');
const session = require('express-session');
const favicon = require('serve-favicon');
const path = require('path');
const MySQLStore = require('express-mysql-session');
require('dotenv').config()

  // PROCESS .ENV FILE
  const PORT = process.env.PORT || 3001;
  const MYSQL_HOST = process.env.MYSQL_HOST;
  const MYSQL_USER = process.env.MYSQL_USER;
  const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
  const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

// Load up mySQL
  const mysql = require('mysql2');
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

// SESSION
  app.use(session({
    cookie:{
      secure: true,
      maxAge:60000
    },
    store: new MySQLStore({
      host: 'your-hostname-or-ip-address',
      user: 'your-username',
      password: 'your-password',
      database: 'your-database-name'
    }),
    secret: 'supersecret',
    saveUninitialized: true,
    resave: false
  }));

// CONNECT MYSQL
  const connection = mysql.createConnection({
      host: 'your-hostname-or-ip-address',
      user: 'your-username',
      password: 'your-password',
      database: 'your-database-name'
  });
    
  connection.connect();

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

// HOW MANY TIMES VISITED
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

// TODO

// Replace all instances of Mongoose model methods with MySQL methods.
// adjust your data models and queries accordingly.