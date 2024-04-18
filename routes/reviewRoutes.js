const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({mergeParams: true});

router.use(authController.protected);

router
    .route('/')
    .get(reviewController.getAllReview)
    .post(
        authController.restricTo('user'),
        reviewController.createReview
    )

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restricTo('user'),
        reviewController.updateReview
    )
    .delete(
        authController.restricTo('user'),
        reviewController.deleteReview
    )

module.exports = router;