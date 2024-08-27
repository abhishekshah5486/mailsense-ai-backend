const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    }
});

const productModel = new mongoose.model("Product", productSchema);
// Create a product
app.post('/product', async (req, res) => {
    const product = productModel.create({
        product_name: req.body.product_name
    })
    console.log(product);
    return res.status(201).json({
        message: "Product created successfully"
    });
});

const port = 8081 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// const username = "abhishekshah5486";
// const password = "i8SBTBdZyySqPNdG";
// const mongoURL = "mongodb+srv://abhishekshah5486:<db_password>@cluster0.szhpw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"