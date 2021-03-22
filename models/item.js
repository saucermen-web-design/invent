const { urlencoded } = require("express");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  condition: Number,
  count: { type: String, required: true },
  forSale: Boolean,
  listing: String,
  dateAdded: Date,
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
