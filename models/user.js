// REQUIRED MODULES
const mongoose = require('mongoose');
    
// DEFINIE SCHEMA
    const Schema = mongoose.Schema;

    const userSchema = new Schema({
        username: String,
        password: String,
    }, {
        timestamps: true,
    });

// EXPORTS
    module.exports = mongoose.model('User', userSchema);