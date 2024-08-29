const userAccountModel = require('../Models/UserAccountModel');

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

// Update access token by email
exports.updateAccessTokenByEmail = async (email, newAccessToken) => {
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
exports.updateExpiresAtByEmail = async (email, newExpiresAt) => {
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