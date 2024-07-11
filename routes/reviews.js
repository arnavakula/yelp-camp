const express = require('express');
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const router = express.Router({ mergeParams: true });

//upload new review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Succesfully created new review!');
    res.redirect(`/campgrounds/${id}`)
}))

//delete review
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}}) //remove instance of review from array within review obj
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Succesfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
