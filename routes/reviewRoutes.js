const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router
    .route('/')
    .get(
        authController.protected,
        reviewController.getAllReview
    )
    .post(
        authController.protected,
        authController.restricTo('user'),
        reviewController.createReview
    )

module.exports = router;