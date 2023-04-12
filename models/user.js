const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    joined: {
        type: Date,
        default: Date.now()
    },
    lastvisit: {
        type: Date,
        default: Date.now()
    },
    counter: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);