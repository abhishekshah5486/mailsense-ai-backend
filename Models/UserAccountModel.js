const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userAccountSchema = new mongoose.Schema({
    userAccountId: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ["GMAIL", "OUTLOOK"],
        required: true
    },
    accountEmail: {
        type: String,
        required: true,
        trim: true
    },
    accessToken: {
        type: String,
        required: false
    },
    refreshToken: {
        type: String,
        required: true
    },
    historyId: {
        type: Number,
        required: false,
    },
    expiresAt: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

const userAccountModel = new mongoose.model("userAccounts", userAccountSchema);
module.exports = userAccountModel;