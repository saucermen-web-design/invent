const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { createUser, pool } = require('../models/user');
const rateLimit = require("express-rate-limit");

const SALT_ROUNDS = 10;

// Limit requests to /login to 5 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please wait a minute and try again",
});


router.get('/new', (req, res) => {
  res.render('users/new');
});

router.post('/users/signup', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await createUser(username, hashedPassword, email);
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', limiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    if (rows.length === 0) {
      res.redirect('/users/login');
    } else {
      const { id, username, password: hashedPassword, email } = rows[0];
      const doesPasswordMatch = await bcrypt.compare(password, hashedPassword);
      if (doesPasswordMatch) {
        req.session.userId = id;
        res.redirect('/items');
      } else {
        res.redirect('/users/login');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    const user = req.session.userId;
    res.render('users/dashboard', { user });
  } else {
    res.redirect('/users/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
