const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const userModel = new mongoose.model("users", userSchema);
module.exports = userModel;