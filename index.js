const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());

const userRoutes = require('./Routes/UserRoutes');
const userAccountRoutes = require('./Routes/UserAccountRoutes');
const gmailAuthRoutes = require('./Routes/AuthRoutes/gmailAuthRoutes');

app.use(express.json());
// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

app.use('/users', userRoutes);
app.use('/users/accounts', userAccountRoutes);
app.use('', gmailAuthRoutes);

const port = 8081 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
