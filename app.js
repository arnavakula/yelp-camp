const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
})

//data parsing for our routes
const port = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//method override (for non get/post requests)
app.use(methodOverride('_method'));

//init ejs engine
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//init routers
app.use('/campgrounds', campgrounds); 
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
})

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

