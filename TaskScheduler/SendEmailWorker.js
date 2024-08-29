const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { connection } = require('./BullMQConfig');

const {sendEmailService} = require('../Services/EmailSenderService');

const sendEmailWorker = new Worker('openaiResponse-queue', async (job) => {
  console.log(`Worker 3 processing job ${job.id}`);
  const response = await sendEmailService(job.data);
  return response;

}, { 
  connection ,
  concurrency: 1,
});

sendEmailWorker.on('completed', job => {
  console.log(`Worker 3 job ${job.id} completed`);
});

sendEmailWorker.on('failed', (job, err) => {
  console.error(`Worker 3 job ${job.id} failed with error ${err.message}`);
});

module.exports = {sendEmailWorker};