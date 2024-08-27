const express = require('express');
const router = require('express').Router();

// Create a product
router.post('/product', async (req, res) => {
    const product = productModel.create({
        product_name: req.body.product_name
    })
    console.log(product);
    return res.status(201).json({
        message: "Product created successfully"
    });
});

module.exports = router;