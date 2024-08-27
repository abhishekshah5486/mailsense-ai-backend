const express = require('express');
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://abhishekshah5486:i8SBTBdZyySqPNdG@cluster0.szhpw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

const app = express();

const port = 8081 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// const username = "abhishekshah5486";
// const password = "i8SBTBdZyySqPNdG";
// const mongoURL = "mongodb+srv://abhishekshah5486:<db_password>@cluster0.szhpw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"