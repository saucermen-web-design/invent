// REQUIRED MODULES
const mongoose = require('mongoose');
const { urlencoded, Router } = require("express");
    
// DEFINIE SCHEMA
    const Schema = mongoose.Schema;

    const userSchema = new Schema({
        username: String,
        password: String,
        email: String,
    }, {
        timestamps: true,
    });

// EXPORTS
    const User = mongoose.model("User", userSchema);

    module.exports = User;