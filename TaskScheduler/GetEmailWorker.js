const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { manageNewEmail } = require('../Controllers/NewUnreadEmailController');
const {addJob2} = require('./Producer');
const { connection } = require('./BullMQConfig');
const {connectDB} = require('../Database/connectDB');

// const redisClient = new Redis(); 

const getEmailWorker = new Worker('email-queue', async (job) => {
  connectDB();
  // console.log(`Worker 1 processing job ${job.id}`);

  // console.log("calling manage new email ",job.data);
  const emailData = await manageNewEmail(job.data);
  console.log("got email data ");
    console.log(emailData);

    if(emailData==null){
      console.log("No new emails in inbox");
    }
    else{
      const response = await addJob2(emailData);
      return response;
    }
  
  
}, {
    connection ,
    concurrency: 1,
});

getEmailWorker.on('completed', job => {
  console.log(`Worker 1 job ${job.id} completed`);
});

getEmailWorker.on('failed', (job, err) => {
  console.error(`Worker 1 job ${job.id} failed with error ${err.message}`);
});

module.exports = {getEmailWorker};