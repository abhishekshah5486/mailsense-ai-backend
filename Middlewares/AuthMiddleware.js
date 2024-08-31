const  jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

// Middleware to extract the jwt token from the request header
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // If the token is verified, add the userId to the request body
        req.body.userId = verified.userId;
    } catch (err) {
        console.log(err.message);
    } finally {
        next();
    }
}
module.exports = authMiddleware;