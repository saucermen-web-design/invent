// REQUIRED MODULES
import express, { Application, Request, Response, NextFunction } from "express";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import favicon from "serve-favicon";
import * as path from "path";
import * as mysql from "mysql2";
import MySQLStore from "express-mysql-session";
import * as dotenv from 'dotenv';

// PROCESS .ENV FILE
dotenv.config();

const PORT: number = parseInt(process.env.PORT || "3001");
const MYSQL_HOST: string = process.env.MYSQL_HOST;
const MYSQL_USER: string = process.env.MYSQL_USER;
const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE: string = process.env.MYSQL_DATABASE;

// CONNECT MYSQL
const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

// Middleware
const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(favicon(path.join(__dirname, "public", "images", "inventIcon.png")));
app.use(
  session({
    cookie: {
      secure: true,
      maxAge: 60000,
    },
    store: new MySQLStore({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
    }),
    secret: "supersecret",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(function (req: Request, res: Response, next: NextFunction) {
  req.date = new Date().toLocaleDateString();
  req.time = new Date().toLocaleTimeString();
  next();
});

// SET VIEW ENGINE
app.set("view engine", "ejs");

// CONTROLLERS
import itemsController from "./controllers/items";
app.use("/items", itemsController);

import usersController from "./controllers/users";
app.use("/users", usersController);

// ROUTING
app.get("/", (req: Request, res: Response) => {
  res.redirect("users/login");
});

// wildcard route
// app.get("*", (req: Request, res: Response) => {
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
