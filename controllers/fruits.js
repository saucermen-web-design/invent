const express = require("express");
const router = express.Router();
const Fruit = require("../models/fruits.js");

// Routes:

// NEW
router.get("/new", (req, res) => {
  res.render("new.ejs");
});

// CREATE
router.post("/", (req, res) => {
  if (req.body.readyToEat === "on") {
    //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else {
    //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }
  Fruit.create(req.body, (error, result) => {
    // res.send(result);
    res.redirect("/fruits");
  });
});

// INDEX..aka SHOW ALL
router.get("/", (req, res) => {
  Fruit.find({}, (error, fruits) => {
    // res.send(fruits);
    res.render("index.ejs", { fruits });
  });
});

// SECRET SEED ROUTE
router.get("/seed", (req, res) => {
  Fruit.create(
    [
      {
        name: "grapefruit",
        color: "pink",
        readyToEat: true
      },
      {
        name: "grape",
        color: "purple",
        readyToEat: false
      },
      {
        name: "avocado",
        color: "green",
        readyToEat: true
      }
    ],
    (error, data) => {
      console.log(data);
      res.redirect("/fruits");
    }
  );
});

// SHOW ONE
router.get("/:id", (req, res) => {
  Fruit.findById(req.params.id, (err, foundFruit) => {
    res.render("show.ejs", {
      fruit: foundFruit
    });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  // res.send('deleting...')
  Fruit.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/fruits");
  });
});

// EDIT
// /fruits/5e5a93cd12675b4c0efcb17e/edit
router.get("/:id/edit", (req, res) => {
  Fruit.findById(req.params.id, (err, foundFruit) => {
    console.log("foundFruit", foundFruit);
    res.render("edit.ejs", {
      fruit: foundFruit
    });
  });
});

// PUT/UPDATE
router.put("/:id", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  // res.send(req.body)
  Fruit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updateModel) => {
      if (err) {
      } else {
        // res.send(updateModel);
        res.redirect("/fruits");
      }
    }
  );
});

module.exports = router;
