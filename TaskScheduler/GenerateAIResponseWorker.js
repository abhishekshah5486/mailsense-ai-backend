const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { connection } = require('./bullmq-config');
const {connectDB} = require('../Database/connectDB');
const { generateResponse } = require('../Services/OpenAIService');
const {addJob3} = require('./producer');

// const redisClient = new Redis();
 
const generateResponseWorker = new Worker('newEmails-queue', async (job) => {
  connectDB();
  // console.log(`Worker 2 processing job ${job.id}`);
  // console.log(job.data);
  const emailData  = await generateResponse(job.data.thread);



  if(emailData==null){
    console.log('AI response:', 'No response');
  }
  else{
    
    const finalResponse = {
      emailData : emailData,
      originalMessageData : job.data.originalMessage
    }

    const response 
    = await addJob3(finalResponse);
    return response;
  }

  

  
}, { 
  connection ,
  concurrency: 1,
});

generateResponseWorker.on('completed', job => {
  console.log(`Worker 2 job ${job.id} completed`);
});

generateResponseWorker.on('failed', (job, err) => {
  console.error(`Worker 2 job ${job.id} failed with error ${err.message}`);
});

module.exports = {generateResponseWorker};