const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({mergeParams: true});

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