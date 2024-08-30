const express = require('express');
const router = express.Router();
const userAccountControllers = require('../Controllers/NewUnreadEmailController');

// Retrieve all user accounts for a userId
router.get('/:userId', userAccountControllers.retrieveAllUserAccountsByUserId);

// Retrieve all user accounts for an email account
router.get('/', userAccountControllers.retrieveAllUserAccountsByEmail);

module.exports = router;