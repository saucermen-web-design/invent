// REQUIRED MODULES
    const express = require("express");
    const router = express.Router();
    const User = require('../models/user');
    const bcrypt = require('bcrypt');
    const SALT_ROUNDS = 12;  //  SETS AMOUNT OF PASSES THROUGH SALTING ALGORITHM

// DEFINE ROUTES
    router.get("/new", (req, res) => {
        res.render("users/new");
    });

    router.post("/signup", (req, res) => {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));  // FETCHES ENTERED PASSWORD FROM REQ.BODY AND PROCESSES THROUGH HASHING AND SALTING ALGORITHMS
        User.create(req.body, function(error, newUser) { // ADDS NEW USER TO DB
            console.log(newUser);
            res.redirect('/login');
        });
    });

    router.get('/login', (req, res) => {
        res.render('users/login');
    }); 

    router.post('/login', (req, res) => {
        User.findOne({
            username: req.body.username // FETCHES USERNAME FROM REQ.BODY AND ASSIGNS TO VARIABLE
        }, function (error, foundUser) {
            if (foundUser === null) {  // HANDLES CHECK ON USER EXISTANCE
                res.redirect('users/signin');
            } else {  // CHECKS PASSWORD MATCH
                const doesPasswordMatch = bcrypt.compareSync(req.body.password, foundUser.password); // COMPARES PASSWORD IN DB WITH ENTERED PASSWORD FRIN REQ.BODY
                if (doesPasswordMatch) {
                    req.session.userId = foundUser._id; // CREATES USER SESSION
                    console.log(req.session) // we can also log out the session to see the results
                    res.redirect('/users/dashboard');
                } else {
                    res.redirect('/users/signin');  // REDIRECTS THEM TO SIGNIN IF THEIR PASSWORD DOES NOT MATCH
                }
            }
        });
    });

// DEFINE PROTECTED ROUTES
    router.get('/dashboard', (req, res) => { 
        if(req.session.userId) {
            res.render('users/dashboard');
        } else {
            res.redirect('/users/signin');
        };
    });

    router.get('/users/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

// EXPORTS
    module.exports = router;