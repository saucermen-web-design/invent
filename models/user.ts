import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';

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

async function createUsersTable(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      createdAt DATETIME,
      updatedAt DATETIME,
      PRIMARY KEY (id)
    )`);
  } finally {
    conn.release();
  }
}

createUsersTable();

async function createUser(username: string, password: string, email: string): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.query('INSERT INTO users (username, password, email, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [username, password, email]);
  } finally {
    conn.release();
  }
}

export { createUser, pool };
