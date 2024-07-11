const express = require('express');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const router = express.Router();

//get all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

//get form for creating new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

//show specific campground details
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}))

//add new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();

    req.flash('success', 'Succesfully added new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//get form to update campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { campground });
}))

//update campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Succesfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}))

//delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }

    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!')
    res.redirect(`/campgrounds`);
}))

module.exports = router; 