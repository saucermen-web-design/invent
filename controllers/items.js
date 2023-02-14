// REQUIRED MODULES 
  const express = require("express");
  const router = express.Router();
  const {
    addItem,
    getAllItems,
    getItemById,
    updateItemById,
    deleteItemById,
  } = require("../models/item");

// CREATE
  router.get("/new", (req, res) => {
    res.render("items/new");
  });


  router.post("/", (req, res) => {
    if (req.body.forSale === "on") {
      //if checked, req.body.forSale is set to 'on'
      req.body.forSale = true;
    } else {
      //if not checked, req.body.forSale is undefined
      req.body.forSale = false;
    }

    addItem(req.body, (error, result) => {
      res.redirect("/items");
    });
  });

// INDEX..aka SHOW ALL
router.get("/", (req, res) => {
  getAllItems((error, items) => {
    if (error) {
      console.log(error);
      items = [];
      res.locals.items = items;
    }
    console.log('Rendered items:', items); // debug statement
    res.render("items/index", { items: items });
  });
});


// SHOW ONE
  router.get("/:id", (req, res) => {
    getItemById(req.params.id, (err, foundItem) => {
      res.locals.items = items;
      // check if the item has a name property
      if (foundItem && foundItem.name) {
        res.render("items/show", {
          item: foundItem,
        });
      } else {
        console.log("No items....");
        res.redirect("/items");
      }
    });
  });


// DELETE
  router.delete("/:id", (req, res) => {
    deleteItemById(req.params.id, (err, data) => {
      res.redirect("/items");
    });
  });

// EDIT
  router.get("/:id/edit", (req, res) => {
    getItemById(req.params.id, (err, foundItem) => {
      res.render("items/edit", {
        item: foundItem,
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

    updateItemById(req.params.id, req.body, (err, updateModel) => {
      if (err) {
      } else {
        res.redirect("/items");
      }
    });
  });

// EXPORT
  module.exports = router;
