const express = require('express');
require('dotenv').config();

exports.getGoogleAuthUrl = async (req, res) => {
    try {
        const userId = req.params.userId;

        function getGoogleOAuthUrl(userId) {
    
            const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        
            const options = {
                redirect_uri: String(process.env.GOOGLE_REDIRECT_URI),
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