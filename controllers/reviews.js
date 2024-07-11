const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Succesfully created new review!');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}}) //remove instance of review from array within review obj
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Succesfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}