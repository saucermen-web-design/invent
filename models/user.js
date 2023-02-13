// REQUIRED MODULES
    const dotenv = require('dotenv');
    const mysql = require('mysql2/promise');

// LOAD ENVIRONMENT VARIABLES
    dotenv.config();
    const PORT = process.env.PORT || 3001;
    const MYSQL_HOST = process.env.MYSQL_HOST;
    const MYSQL_USER = process.env.MYSQL_USER;
    const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
    const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

// CREATE CONNECTION POOL
    const pool = mysql.createPool({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,

    });
    
// DEFINE SCHEMA
    const userSchema = {
        username: 'VARCHAR(255)',
        password: 'VARCHAR(255)',
        email: 'VARCHAR(255)',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',

    };

// CREATE USERS TABLE IS IT DOES NOT EXIST
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

// CREATE NEW USER
    async function createUser(username, password, email) {
        const conn = await pool.getConnection();
        await conn.query('INSERT INTO users (username, password, email, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [username, password, email]);
        conn.release();
    }

// EXPORT
    module.exports = { createUser, pool };
