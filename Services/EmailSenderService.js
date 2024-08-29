const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const userAccountControllers = require('../Controllers/UserAccountController');
const { google } = require('googleapis');

async function sendEmailService({emailData, originalMessageData}) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLEAUTH_REDIRECT_URI
      );

      const messageId = originalMessageData.data.id;
        const threadId = originalMessageData.data.threadId;
        const headers = originalMessageData.data.payload.headers;
        const subject = headers.find(h => h.name.toLowerCase() === 'subject').value;
        const to = headers.find(h => h.name.toLowerCase() === 'from').value;
        const fromEmail = emailData.from;


      console.log("email data in service ", fromEmail);
      console.log("type of " , typeof(fromEmail));

      const refreshToken = await userAccountControllers.getRefreshTokenByEmail(fromEmail);

      console.log("refresh i main ", refreshToken);

      const accessToken = await userAccountControllers.getAccessToken(fromEmail);

      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });
        console.log("set credentials suucessfully");

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      try {
        
        const message = [
          `From: ${fromEmail}`,
          `To: ${to}`,
          `Subject: Re: ${subject}`,
          `In-Reply-To: <${messageId}@mail.gmail.com>`,
          `References: <${messageId}@mail.gmail.com>`,
          'Content-Type: text/plain; charset="UTF-8"',
          '',
          emailData.body
        ].join('\r\n');

        const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: threadId,
      },
    });
    // label , gmail , res
   
    const finalRes = await addLabelToEmail({
      labelName:emailData.label , 
      gmail , 
      res
    });
    console.log('Reply sent successfully:', finalRes);
    return finalRes;
  } catch (error) {
    console.error('Error sending reply:', error);
    throw error;
  }

}

async function addLabelToEmail({labelName , gmail , res}) {
  const labelRes = await gmail.users.labels.list({ userId: 'me' });
  const label = labelRes.data.labels.find(l => l.name === labelName);

  if (label) {
    await gmail.users.messages.modify({
      userId: 'me',
      id: res.data.id,
      requestBody: {
        addLabelIds: [label.id],
      },
    });
    console.log(`Label "${labelName}" applied to the message.`);
  } else {
    console.warn(`Label "${labelName}" not found. Creating new label.`);
    const newLabel = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    });
    await gmail.users.messages.modify({
      userId: 'me',
      id: res.data.id,
      requestBody: {
        addLabelIds: [newLabel.data.id],
          },
        });
        console.log(`New label "${labelName}" created and applied to the message.`);
      }
    

    return res.data;
   
}

module.exports = {
    sendEmailService,
}