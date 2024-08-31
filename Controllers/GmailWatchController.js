const {connectDB} = require('../Database/connectDB');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const {google} = require('googleapis');
const userAccountController = require('./UserAccountController');

exports.removeUserAccountFromGmailWatchByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        await stopWatchForUser(email);
        return res.status(200).json({
            success: true,
            message: 'Gmail watch stopped successfully',
            email: email
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Error stopping Gmail watch',
            error: err
        });
    }
}

const stopGmailWatch = async (auth, userId = 'me') => {
    try {
      const gmail = google.gmail({ version: 'v1', auth });
      await gmail.users.stop({
        userId: userId
      });
      console.log('Gmail watch stopped successfully');
    } catch (error) {
      console.error('Error stopping Gmail watch:', error);
      throw error;
    }
}
const createAuthClient = async (refreshToken , accessToken) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
    );
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    return oauth2Client;
}
const stopWatchForUser = async (email) => {
    await connectDB();
    
    const refreshToken = await userAccountController.getRefreshTokenByEmail(email);
    const accessToken = await userAccountController.getAccessToken(email);
    
    const authClient = await createAuthClient(refreshToken , accessToken);
    
    await stopGmailWatch(authClient);
    await userAccountController.deleteUserAccountByEmail(email);
    
    console.log("Gmail watch stopped successfully for user ", email);
    
    }