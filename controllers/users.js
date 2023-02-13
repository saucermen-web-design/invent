// REQUIRED MODULES
    const express = require('express');
    const router = express.Router();
    const { createUser, pool } = require('../models/user');
    const bcrypt = require('bcrypt');
    const SALT_ROUNDS = 10;

// 
    router.get('/new', (req, res) => {
        res.render('users/new');
    });

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

    router.get('/login', (req, res) => {
        res.render('users/login');
    });

    router.post('/login', (req, res) => {
        const { username, password } = req.body;

        pool.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            } else if (results.length === 0) {
                res.redirect('/users/login');
            } else {
                const { id, username, password: hashedPassword, email } = results[0];
                const doesPasswordMatch = await bcrypt.compare(password, hashedPassword);
                if (doesPasswordMatch) {
                    req.session.userId = id;
                    res.redirect('/items');
                } else {
                    res.redirect('/users/login');
                }
            }
        });
    });

    router.get('/dashboard', (req, res) => {
        if (req.session.userId) {
            res.render('items/index');
        } else {
            res.redirect('/users/login');
        }
    });

    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    module.exports = router;
