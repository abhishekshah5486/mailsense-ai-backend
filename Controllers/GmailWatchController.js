const {connectDB} = require('../Database/connectDB');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

exports.removeUserAccountFromGmailWatchByEmail = async (req, res) => {

}