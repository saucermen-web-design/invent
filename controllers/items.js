const express = require("express");
const router = express.Router();
const itemModel = require("../models/item");
require('dotenv').config();

// CREATE
router.get("/new", (req, res) => {
  res.render("items/new");
});

router.post("/", async (req, res) => {
  req.body.forSale = req.body.forSale === "on";
  try {
    const result = await itemModel.addItem(req.body);
    res.redirect("/items");
  } catch (error) {
    console.log(error);
    res.status(500).send('Error adding item');
  }
});

// INDEX..aka SHOW ALL
router.get("/", async (req, res) => {
  try {
    const items = await itemModel.getAllItems();
    res.render("items/index", { items });
    console.log('Rendered items:', items); // debug statement
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting items');
  }
});

// SHOW ONE
router.get("/:id", async (req, res) => {
  try {
    const foundItem = await itemModel.getItemById(req.params.id);
    if (!foundItem) {
      return res.status(404).send('Item not found');
    }
    res.render("items/show", {
      item: foundItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting item');
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const data = await itemModel.deleteItemById(req.params.id);
    res.redirect("/items");
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting item');
  }
});

// EDIT
router.get("/:id/edit", async (req, res) => {
  try {
    const foundItem = await itemModel.getItemById(req.params.id);
    if (!foundItem) {
      return res.status(404).send('Item not found');
    }
    res.render("items/edit", {
      item: foundItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting item');
  }
});

// PUT/UPDATE
router.put("/:id", async (req, res) => {
  req.body.forSale = req.body.forSale === "on";
  try {
    const updateModel = await itemModel.updateItemById(req.params.id, req.body);
    res.redirect("/items");
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating item');
  }
});

module.exports = router;
