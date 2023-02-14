// REQUIRED MODULES
  const { urlencoded } = require("express");
  const mysql = require("mysql2");
  require('mysql2/promise');
  const dotenv = require('dotenv');


// PROCESS .ENV FILE
  dotenv.config();
  const MYSQL_HOST = process.env.MYSQL_HOST;
  const MYSQL_USER = process.env.MYSQL_USER;
  const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
  const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

// CREATE AND TEST CONNECTION
  const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    connectTimeout: 20000, // set connection timeout to 20 seconds
  });

  connection.connect((err) => {
    if (err) throw err;
    // console.log("Connected to MySQL!");
  });

// DEFINE SCHEMA
  const itemSchema = {
    id: 'INT(11) NOT NULL AUTO_INCREMENT',
    type: 'VARCHAR(255) NOT NULL',
    name: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    itemCondition: 'INT',
    count: 'INT NOT NULL',
    forSale: 'BOOLEAN NOT NULL',
    listing: 'TEXT',
    dateAdded: 'DATETIME NOT NULL',
  };

// CREATE ITEMS TABLE IF NEEDED
const createItemsTable = `CREATE TABLE IF NOT EXISTS items (
  id INT(11) NOT NULL AUTO_INCREMENT,
  type VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  itemCondition INT,
  count INT NOT NULL,
  forSale BOOLEAN NOT NULL,
  listing TEXT,
  dateAdded DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)`;

  connection.query(createItemsTable, (err, results) => {
    if (err) throw err;
    // console.log("Created items table!");
  });
  // conn.release();

// ADD ITEM
  const addItem = (item, cb) => {
    const { type, name, description, itemCondition, count, forSale, listing, dateAdded } = item;
    const sql = `INSERT INTO items (type, name, description, itemCondition, count, forSale, listing, dateAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [type, name, description, itemCondition, count, forSale, listing, dateAdded], (err, result) => {
      if (err) throw err;
      cb(result);
    });
    // conn.release();
  };

// FETCH ALL ITEMS
const getAllItems = (cb) => {
  const sql = `SELECT * FROM items`;
  connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log('Fetched items:', results); // debug statement
    cb(results);
  });
};


// FETCH ITEM
  const getItemById = (id, cb) => {
    const sql = `SELECT * FROM items WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
      if (err) throw err;
      cb(result);
    });
    // conn.release();
  };

// UPDATE ITEM
  const updateItemById = (id, updates, cb) => {
    const sql = `UPDATE items SET ? WHERE id = ?`;
    connection.query(sql, [updates, id], (err, result) => {
      if (err) throw err;
      cb(result);
    });
    // conn.release();
  };

// DELETE ITEM 
  const deleteItemById = (id, cb) => {
    const sql = `DELETE FROM items WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
      if (err) throw err;
      cb(result);
    });
    // conn.release();
  };

// EXPORT
  module.exports = {
    itemSchema,
    addItem,
    getAllItems,
    getItemById,
    updateItemById,
    deleteItemById,
  };
