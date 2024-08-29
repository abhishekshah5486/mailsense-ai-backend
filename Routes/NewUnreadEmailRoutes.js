const express = require('express');
const router = express.Router();
const {addJob} = require('../TaskScheduler/Producer');


router.post('/notifications', async (req, res) => {
  
    const emailData = await addJob(req.body);
    return emailData;
    
});

module.exports = router;