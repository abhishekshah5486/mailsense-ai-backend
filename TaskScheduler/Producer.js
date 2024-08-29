const { emailQueue , newEmailsQueue , openaiResponseQueue} = require('./BullMQConfig');

async function addJob(jobData ) {
  await emailQueue.add('task', jobData);
  console.log('Job added to queue1:', jobData);
}

async function addJob2(jobData) {
    await newEmailsQueue.add('task', jobData);
    console.log('Job added to queue2:', jobData);
}

async function addJob3(jobData) {
    await openaiResponseQueue.add('task', jobData);
    console.log('Job added to queue3:', jobData);
}
module.exports = { addJob , addJob2 , addJob3};