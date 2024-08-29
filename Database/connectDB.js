const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            isConnected = true;
            console.log('Database connected');
        })
        .catch((err) => {
            console.log('Error connecting to database:', err);
        })
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = { connectDB };