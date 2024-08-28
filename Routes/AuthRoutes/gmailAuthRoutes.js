const express = require('express');
const router = express.Router();

const gmailAuthControllers = require('../../Controllers/AuthControllers/gmailAuthController');

// Initalize the Gmail OAuth2.0 flow
router.post('/:userId', gmailAuthControllers.getGoogleAuthUrl);

module.exports = router;
