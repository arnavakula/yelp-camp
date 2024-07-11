const express = require('express');
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

//upload new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//delete review
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
