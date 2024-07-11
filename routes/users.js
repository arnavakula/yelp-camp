const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

const router = express.Router();

//get register page
router.get('/register', (req, res) => {
    res.render('users/register');
})

//create new user
router.post('/register', catchAsync(async (req, res) => {
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Camp Sage!');
        res.redirect('/campgrounds');
    } catch(err){
        req.flash('error', err.message);
        res.redirect('/register');
    }
}))

//get login page
router.get('/login', (req, res) => {
    res.render('users/login');
})

//authenticate user
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async (req, res) => {
    req.flash('success', 'Succesfully logged in, welcome!');
    res.redirect('/campgrounds');
}))

//logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully logged out!');
        res.redirect('/campgrounds');
    });
});

module.exports = router;