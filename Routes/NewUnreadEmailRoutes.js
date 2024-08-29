const express = require('express');
const router = express.Router();
const {addJob} = require('../Task-Scheduler/producer');


router.post('/notifications', async (req, res) => {
  
    const emailData = await addJob(req.body);
    return emailData;
    
});

module.exports = router;