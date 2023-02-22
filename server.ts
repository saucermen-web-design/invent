// REQUIRED MODULES  
  const express = require("express");
  const app = express();
  const methodOverride = require("method-override");
  const morgan = require('morgan');
  const session = require('express-session');
  const favicon = require('serve-favicon');
  const path = require('path');
  const mysql = require('mysql2');
  const MySQLStore = require('express-mysql-session');
  require('dotenv').config()

// PROCESS .ENV FILE
  const PORT = process.env.PORT || 3001;
  const MYSQL_HOST = process.env.MYSQL_HOST;
  const MYSQL_USER = process.env.MYSQL_USER;
  const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
  const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

// CONNECT MYSQL
  const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  });

// Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.use(express.static('public'));
  app.use(morgan('dev'));
  app.use(favicon(path.join(__dirname,'public','images','inventIcon.png')));
  // SESSION
  app.use(session({
    cookie:{
      secure: true,
      maxAge:60000
    },
    store: new MySQLStore({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
    }),
    secret: 'supersecret',
    saveUninitialized: true,
    resave: false
  }));
  // const requireSession = (req, res, next) => {
  //   if (!req.session || !req.session.user) {
  //     // redirect to login page if session not found
  //     res.redirect('/users/login');
  //   } else {
  //     // session found, proceed to route handlers
  //     next();
  //   }
  // };
  
  // app.use(/^\/(?!users\/(login|signup)).*/, requireSession);
  

  app.use(function(req, res, next) {
    req.date = new Date().toLocaleDateString();
    req.time = new Date().toLocaleTimeString();
    next();
  });
  // // ERROR HANDLING
  // app.use(function(req, res, next) {
  //   res.status(404).send("Sorry, the page you requested does not exist.");
  // });
  // app.use(function (err, req, res, next) {
  //   console.error(err.stack);
  //   res.status(500).send('Something broke!');
  // });

// SET VIEW ENGINE 
  app.set('view engine', 'ejs');

// CONTROLLERS
  const itemsController = require("./controllers/items");
  app.use("/items", itemsController);

  const usersController = require("./controllers/users");
  app.use("/users", usersController);


// ROUTING
  app.get("/", (req, res) => {
    res.redirect("users/login");
  });

// wildcard route
  // app.get("*", (req, res) => {
  //     res.redirect("/");
  // });

// // HOW MANY TIMES VISITED
//   app.get('/times-visited', function(req, res) {
//     if(req.session.visits) {
//         req.session.visits++;
//     } else {
//         req.session.visits = 1;
//     };
//     res.send(`<h1>You've visited this page ${req.session.visits} time(s) </h1>`);
// });

// Web server:
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

  // console.log(process.cwd());
  