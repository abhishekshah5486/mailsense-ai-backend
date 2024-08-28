const express = require('express');
const router = express.Router();

const gmailAuthControllers = require('../../Controllers/AuthControllers/gmailAuthController');

// Initalize the Gmail OAuth2.0 flow
router.post('/auth/gmail/:userId', gmailAuthControllers.getGoogleAuthUrl);

// Route to handle google auth callback
router.get('/authenticated', gmailAuthControllers.handleAuthCallback)

module.exports = router;
