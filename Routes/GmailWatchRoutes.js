const express = require('express');
const router = express.Router();

const gmailWatchControllers = require('../Controllers/GmailWatchController');

//  Remove user account from gmail watch
router.delete('/watch/remove', gmailWatchControllers.removeUserAccountFromGmailWatchByEmail);


module.exports = router;