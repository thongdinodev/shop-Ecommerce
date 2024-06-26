const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// use protected auth for all route

router.use('/:productId/reviews', reviewRouter);


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
        productController.uploadProductImage,
        productController.updateProduct
    )
    .delete(
        authController.protected,
        authController.restricTo('admin'),
        productController.deleteProduct
    )

// router
//     .route('/:productId/reviews')
//     .post(
//         authController.protected,
//         authController.restricTo('user'),
//         reviewController.createReview
//     )

module.exports = router;