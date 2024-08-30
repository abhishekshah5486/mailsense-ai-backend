const express = require('express');
const mongoose = require('mongoose');
const sendEmailWorker = require('./TaskScheduler/SendEmailWorker');
const {connectDB} = require('./Database/connectDB');

const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());

const userRoutes = require('./Routes/UserRoutes');
const userAccountRoutes = require('./Routes/UserAccountRoutes');
const gmailAuthRoutes = require('./Routes/AuthRoutes/gmailAuthRoutes');
const gmailWatchRoutes = require('./Routes/GmailWatchRoutes');
const newUnreadEmailRoutes = require('./Routes/NewUnreadEmailRoutes');

app.use(express.json());
// Connect to MongoDB Database
async function connectDataBase(){
    await connectDB();
}
connectDataBase();

app.use('/users', userRoutes);
app.use('/users/accounts', userAccountRoutes);
app.use('', gmailAuthRoutes);
app.use('/', newUnreadEmailRoutes);
app.use('/gmail', gmailWatchRoutes);

app.get('/', (req, res) => {
    res.send("Authorization completed succesfully");
});

const port = 8081 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
