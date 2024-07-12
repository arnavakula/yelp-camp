const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
