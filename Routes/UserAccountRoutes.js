const express = require('express');
const router = express.Router();
const userAccountControllers = require('../Controllers/UserAccountController');

// Retrieve all user accounts for a userId
router.get('/:userId', userAccountControllers.retrieveAllUserAccountsByUserId);

module.exports = router;