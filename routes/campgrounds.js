const express = require('express');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');

const router = express.Router();

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//get all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

//get form for creating new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

//show specific campground details
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}))

//add new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();

    req.flash('success', 'Succesfully added new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//get form to update campground
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { campground });
}))

//update campground
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    await Campground.findByIdAndUpdate(id, campground);
    req.flash('success', 'Succesfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}))

//delete campground
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;