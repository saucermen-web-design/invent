const mysql = require("mysql2/promise");
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const ITEM_TABLE = 'items';

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

const createItemsTable = `CREATE TABLE IF NOT EXISTS ${ITEM_TABLE} (
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

const addItem = async (item) => {
  const { type, name, description, count, forSale, listing, dateAdded } = item;
  const sql = `INSERT INTO ${ITEM_TABLE} (type, name, description, count, forSale, listing, dateAdded) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [type, name, description, count, forSale, listing, dateAdded];
  const [result] = await pool.execute(sql, values);
  return result.insertId;
};

const getAllItems = async () => {
  const sql = `SELECT * FROM ${ITEM_TABLE}`;
  const [rows] = await pool.execute(sql);
  return rows;
};

const getItemById = async (id) => {
  const sql = `SELECT * FROM ${ITEM_TABLE} WHERE id = ?`;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const updateItemById = async (id, updates) => {
  const columns = Object.keys(updates);
  const values = Object.values(updates);
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `UPDATE ${ITEM_TABLE} SET ${columns.map(c => `${c} = ?`).join(', ')} WHERE id = ?`;
  const [result] = await pool.execute(sql, [...values, id]);
  return result;
};

const deleteItemById = async (id) => {
  const sql = `DELETE FROM ${ITEM_TABLE} WHERE id = ?`;
  const [result] = await pool.execute(sql, [id]);
  return result;
};

module.exports = {
  itemSchema,
  addItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById,
};
