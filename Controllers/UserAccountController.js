const userAccountModel = require('../Models/UserAccountModel');
const {connectDB} = require('../Database/connectDB');
const path = require('path');
const { tryCatch } = require('bullmq');

require('dotenv').config({path: path.join(__dirname, '../.env')});

exports.saveUserToDb = async (userAccountDetails) => {
    try {
        // Check if the user already exists in the database
        const existingUser = await userAccountModel.findOne({accountEmail: userAccountDetails.accountEmail});
        if (existingUser) {
            return;
        }
        let accountType = 'OUTLOOK';
        if (userAccountDetails.iss === 'https://accounts.google.com') {
            accountType = 'GMAIL';
        }
        const userAccount = new userAccountModel({
            userId: userAccountDetails.userId,
            accountType: accountType,
            accountEmail: userAccountDetails.accountEmail,
            accessToken: userAccountDetails.accessToken,
            refreshToken: userAccountDetails.refreshToken,
            expiresAt: userAccountDetails.expiresIn,
        });

        const savedUserAccount = userAccount.save();
        return savedUserAccount;
    } catch (err) {
        // Log the error and rethrow it
        console.error('Error saving user account to database:', err);
        throw err;
    }
}

// Retrieve refresh token by email
exports.getRefreshTokenByEmail = async (email) => {
    try {
        await connectDB();
        const userAccount = await userAccountModel.findOne({accountEmail: email});
        return userAccount.refreshToken;
    }
    catch (err) {
        console.error('Error getting refresh token:', err);
        throw err;
    }
}

// Retrieve access token by email and generate new access token if expired
exports.getAccessToken = async(email)=>{
    try {
        await connectDB();
        const userAccount = await userAccountModel.findOne({accountEmail: email});
        // console.log('userAccount:', userAccount);
        let accessToken = userAccount.accessToken;
        let expiresAt = userAccount.expiresAt;

        if(expiresAt <= Date.now()){
            accessToken = await generateNewAccessToken(email , userAccount.refreshToken);
        }
        return accessToken;
    }
    catch (err) {
        console.error('Error getting refresh token:', err);
        throw err;
    }

}

// Method to generate a new access token using the refresh token
async function generateNewAccessToken(email , refreshToken){
    const url = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams();
  params.append('client_id', process.env.GOOGLE_CLIENT_ID);
  params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
  params.append('refresh_token', refreshToken);
  params.append('grant_type', 'refresh_token');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    //save the new access token to the database
    await updateAccessTokenByEmail(email , data.access_token);
    await updateExpiresAtByEmail(email , Date.now() + (45*60*1000));

    return data.access_token;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
  }

}

// Update access token by email
const updateAccessTokenByEmail = async (email, newAccessToken) => {
    try {
        const updatedUserAccount = await userAccountModel.findOneAndUpdate(
            {accountEmail: email}, 
            {accessToken: newAccessToken},
            { new: true }
        );
        if (updatedUserAccount) return updatedUserAccount;
        else {
            throw new Error(`No user found with email: ${email}`);
        }
    } catch (err) {
        console.error(`Error updating access token for email ${email}:`, err.message);
        throw new Error(`Failed to update access token for email ${email}. Please try again later.`);
    }
}

// Update expiresAt by email
const updateExpiresAtByEmail = async (email, newExpiresAt) => {
    try {
        const updatedUserAccount = await userAccountModel.findOneAndUpdate(
            {accountEmail: email}, 
            {expiresAt: newExpiresAt}, 
            {new: true}
        );
        if (updatedUserAccount) return updatedUserAccount;
        else {
            throw new Error(`No user found with email: ${email}`);
        }
    } catch (err) {
        console.error(`Error updating expiresAt for email ${email}:`, err.message);
        throw new Error(`Failed to update expiresAt for email ${email}. Please try again later.`);
    }
}

// Delete user account by email
exports.deleteUserAccountByEmail = async (email) => {
    try {
        const deletedUserAccount = await userAccountModel.findOneAndDelete({accountEmail: email});
        if (deletedUserAccount) return deletedUserAccount;
        else {
            throw new Error(`No user found with email: ${email}`);
        }
    } catch (err) {
        console.error('Error deleting user account:', err);
        throw err;
    }
}

// Fetch all users accounts for a user id
exports.retrieveAllUserAccountsByUserId =  async (req, res) => {
    try {
        const userId = req.params.userId;
        const retrievedUserAccounts = await userAccountModel.find({userId: userId});

        // Return an array of objects containing only accountEmail and accountType
        const filteredUserAccounts = retrievedUserAccounts.map((userAccount) => {
            return {
                accountEmail: userAccount.accountEmail,
                accountType: userAccount.accountType
            }
        })
        return res.status(200).json({
            success: true,
            message: 'User accounts retrieved successfully',
            userAccounts: filteredUserAccounts
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve user accounts',
            error: err.message
        });
    }
}

// Retrieve historyId by email
exports.getHistoryIdByEmail = async (email) => {
    try {
        const fetchedUserAccount = await userAccountModel.findOne({accountEmail: email});
        if (!fetchedUserAccount) {
            throw new Error(`No user found with email: ${email}`);
        }
        return fetchedUserAccount.historyId;
    } catch (err) {
        console.log('Error retrieving historyId:', err);
        throw err;
    }
}

// Update history id by email
exports.updateHistoryIdByEmail = async (email, newHistoryId) => {
    try {
        const updatedUserAccount = await userAccountModel.findOneAndUpdate(
            {accountEmail: email}, 
            {historyId: newHistoryId}, 
            {new: true}
        );
        if (updatedUserAccount) return updatedUserAccount;
        else {
            throw new Error(`No user found with email: ${email}`);
        }
    } catch (err) {
        console.log('Error updating historyId:', err);
        throw err;
    }
}
