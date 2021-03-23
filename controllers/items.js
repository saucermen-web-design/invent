const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// Routes:

// NEW
router.get("/new", (req, res) => {
  res.render("items/new");
});

// CREATE
router.post("/", (req, res) => {
  if (req.body.forSale === "on") {
    //if checked, req.body.forSale is set to 'on'
    req.body.forSale = true;
  } else {
    //if not checked, req.body.forSale is undefined
    req.body.forSale = false;
  }
  Item.create(req.body, (error, result) => {
    // res.send(result);
    res.redirect("/items");
  });
});

// INDEX..aka SHOW ALL
router.get("/", (req, res) => {
  Item.find({}, (error, items) => {
    // res.send(items);
    res.render("items/index", { items });
  });
});

// SHOW ONE
router.get("/:id", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    res.render("items/show", {
      item: foundItem
    });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  console.log(`${req.params.id} is deleted...`);
  Item.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("items/index");
  });
});

// EDIT
// /items/5e5a93cd12675b4c0efcb17e/edit
router.get("/:id/edit", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    console.log("foundItem", foundItem);
    res.render("items/edit", {
      item: foundItem
    });
  });
});

// PUT/UPDATE
router.put("/:id", (req, res) => {
  if (req.body.forSale === "on") {
    req.body.forSale = true;
  } else {
    req.body.forSale = false;
  }
  // res.send(req.body)
  Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updateModel) => {
      if (err) {
      } else {
        // res.send(updateModel);
        res.redirect("/items");
      }
    }
  );
});

module.exports = router;
