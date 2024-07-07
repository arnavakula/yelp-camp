const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
})

const port = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})

//get all campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

//get form for creating new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

//show specific campground details
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
}))

//add new campground
app.post('/campgrounds', catchAsync(async (req, res, next) => {
    if(!req.body.campground){
        throw new ExpressError('Invalid Campground Data', 400);
    }
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//get form to update campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

//update campground
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    await Campground.findByIdAndUpdate(id, campground);
    res.redirect(`/campgrounds/${id}`);
}))

//delete campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

//runs if no other route is valid (not every time like app.use)
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//fallback point for all errors
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'UNDEFINED ERROR';
    res.status(statusCode).render('error', { err });
})


app.listen(port, () => {
    console.log(`serving on port ${port}`);
})

