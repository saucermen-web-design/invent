// REQUIRED MODULES
const express = require('express');
const router = express.Router();
const { createUser, pool } = require('../models/user');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// NEW USER FORM
router.get('/new', (req, res) => {
  res.render('users/new');
});

// CREATE NEW USER
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await createUser(username, hashedPassword, email);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGIN FORM
router.get('/login', (req, res) => {
  res.render('users/login');
});

// LOGIN USER
router.post('/login', async (req, res) => {
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

// DASHBOARD
router.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.render('items/index');
  } else {
    res.redirect('/users/login');
  }
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
