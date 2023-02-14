const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

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

async function createUsersTable() {
  const conn = await pool.getConnection();
  await conn.query(`CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    createdAt DATETIME,
    updatedAt DATETIME,
    PRIMARY KEY (id)
  )`);
  conn.release();
}

createUsersTable();

async function createUser(username, password, email) {
  const conn = await pool.getConnection();
  await conn.query('INSERT INTO users (username, password, email, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [username, password, email]);
  conn.release();
}

module.exports = { createUser, pool };
