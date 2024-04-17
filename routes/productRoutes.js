const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

// use protected auth for all route

router
    .route('/top-5-product')
    .get( 
        productController.aliasTopProducts, 
        productController.getAllProducts
    );

router
    .route('/product-stats')
    .get(
        productController.getProductStats
    )

router
    .route('/')
    .get(productController.getAllProducts)
    .post(
        authController.protected,
        authController.restricTo('admin'),
        productController.createProduct
    );


router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authController.protected,
        authController.restricTo('admin'),
        productController.updateProduct
    )
    .delete(
        authController.protected,
        authController.restricTo('admin'),
        productController.deleteProduct
    )

module.exports = router;