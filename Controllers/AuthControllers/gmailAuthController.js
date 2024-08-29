const express = require('express');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '../../.env')});
const { saveUserToDb } = require('../../Controllers/UserAccountController');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLEAUTH_REDIRECT_URI
);

exports.getGoogleAuthUrl = async (req, res) => {
    try {
        const userId = req.params.userId;

        function getGoogleOAuthUrl(userId) {
    
            const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        
            const options = {
                redirect_uri: String(process.env.GOOGLEAUTH_REDIRECT_URI),
                client_id: String(process.env.GOOGLE_CLIENT_ID),
                access_type: 'offline',
                response_type: 'code',
                prompt: 'consent',
                scope: [
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/gmail.modify",
                ].join(" "),
                state : userId,
            }
        
            const qs = new URLSearchParams(options).toString();
        
            return `${rootUrl}?${qs}`;
        }
    
        const googleOAuthUrl = getGoogleOAuthUrl(userId);
        return res.status(200).json({
            success: true,
            message: "Google OAuth URL generated successfully",
            googleOAuthUrl: googleOAuthUrl
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
}

exports.handleAuthCallback = async (req, res) =>{
    const { code , state } = req.query;
    const userId = state;
    if (!code) {
        return res.status(400).json({
            error: 'Authorization unsuccessful',
            message: 'No authorization code received from Google'
        });
    }

    await saveUser(code, userId, Date.now());
    const redirectUrl = 'http://localhost:3000/home/email-accounts';
    return res.redirect(redirectUrl);
}

async function saveUser(code , userId, timestamp){
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLEAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      const { email, iss } = await getUserEmail(data.id_token);
      
      await saveUserToDb({
        userId : userId,
        accountEmail : email,
        iss : iss,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: timestamp + (45*60 * 1000),
      });
      oauth2Client.setCredentials({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expiry_date: (new Date()).getTime() + (45*60 * 1000)
      });

    const watchResponse = await setupGmailWatch(oauth2Client);

    return watchResponse;
}

async function setupGmailWatch(auth) {
    console.log(auth.acccess_token);
    console.log(auth.refresh_token);
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const watchResponse = await gmail.users.watch({
            userId: 'me',
            requestBody: {
                topicName: `projects/${process.env.PROJECT_ID}/topics/${process.env.TOPIC_NAME}`,
                labelIds: ['INBOX'],
            },
        });

        return watchResponse.data;
    } catch (error) {
        console.error('Error during watch setup:', error);
        throw error;
    }
}

async function getUserEmail(idToken){
    try {
        const decoded = jwt.decode(idToken);
        
        return { email: decoded.email, iss: decoded.iss };

    } catch (err) {
        console.error('Error decoding JWT:', err);
        return null;
    }
}