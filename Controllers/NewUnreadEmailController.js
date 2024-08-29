const {google} = require('googleapis');
const userAccountController = require('./UserAccountController');
const { connectDB } = require('../Database/connectDB');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

// This function creates and returns an authenticated OAuth2Client
async function createAuthClient(refreshToken , accessToken) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLEAUTH_REDIRECT_URI
    );
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    return oauth2Client;
}

async function manageNewEmail(userData){
    try {
        await connectDB();

        let message;
        if (typeof userData === 'object') {
            message = userData;
        } else {
            message = JSON.parse(userData.toString());
        }
        console.log(userData);
        if (message.message && message.message.data) {
            const decodedData = JSON.parse(Buffer.from(message.message.data, 'base64').toString());

            const email = decodedData.emailAddress;
            
            const refreshToken = await userAccountController.getRefreshTokenByEmail(email);

            const messageId = message.message.messageId;
            const accessToken = await userAccountController.getAccessToken(email);

            
            // await processNewEmail(decodedData.emailAddress, messageId, refreshToken);
            let authClient = await createAuthClient(refreshToken , accessToken);
            let allMessages = await retrieveThreadFromMessage(authClient , messageId);
            return allMessages;
            // let unreadMeassge = await  getLatestUnreadMessage(authClient);
            // return unreadMeassge;

            // let processedThreads = await processRecentThreads(accessToken);
        } else {
            console.log('Unexpected message format:', message);
        }

        return res.status(200).send('OK');
    } catch (error) {
        console.error('Error processing notification:', error);
        return res.status(400).send('Error processing notification');
    }    
}
async function retrieveThreadFromMessage(auth, messageId) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
    
        // Step 1: Get the latest unread message
        console.log('Fetching latest unread message...');
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: 'is:unread',
          maxResults: 1,
        });
    
        if (!response.data.messages || response.data.messages.length === 0) {
          console.log('No unread messages found.');
          return null;
        }
    
        const latestMessageId = response.data.messages[0].id;
        console.log(`Latest unread message ID: ${latestMessageId}`);
    
        // Step 2: Get the thread ID of the latest unread message
        console.log('Fetching message details to get thread ID...');
        const messageDetails =  await gmail.users.messages.get({
          userId: 'me',
          id: latestMessageId,
        });

        const threadId = messageDetails.data.threadId;
        console.log(`Thread ID of the latest unread message: ${threadId}`);
    
        // Step 3: Get the entire thread
        console.log('Fetching the entire thread...');
        const thread = await gmail.users.threads.get({
          userId: 'me',
          id: threadId,
        });
    
        console.log('Thread retrieved successfully');
        // console.log(JSON.stringify(thread.data));
        // return thread.data;
        const messageDetails2 = extractMessageDetails(thread.data);
        await removeUnreadLabel(auth, latestMessageId);
        console.log('Extracted message details:', JSON.stringify(messageDetails2, null, 2));
    
        let finalMessage = {
          thread : messageDetails2,
          originalMessage : messageDetails
        };
        return finalMessage;
        
      } catch (error) {
        console.error('Error retrieving latest unread thread:', error.message);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        throw error;
      }
    }

    async function removeUnreadLabel(auth, messageId) {
      const gmail = google.gmail({ version: 'v1', auth });
      
      try {
        await gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            removeLabelIds: ['UNREAD']
          }
        });
        console.log(`UNREAD label removed from message ${messageId}`);
      } catch (error) {
        console.error(`Error removing UNREAD label from message ${messageId}:`, error);
        throw error;
      }
    }
    function extractMessageDetails(threadData) {
        const thread = typeof threadData === 'string' ? JSON.parse(threadData) : threadData;
        
        return thread.messages.map(message => {
          const headers = message.payload.headers;
          const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
      
          let bodyContent = '';
          if (message.payload.body.data) {
            bodyContent = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
          } else if (message.payload.parts) {
            const textPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
            if (textPart && textPart.body.data) {
              bodyContent = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
            }
          }
      
          return {
            id: message.id,
            from: getHeader('from'),
            to: getHeader('to'),
            subject: getHeader('subject'),
            date: getHeader('date'),
            body: bodyContent.trim()
          };
        });
      }

module.exports = {
    manageNewEmail
}