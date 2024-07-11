const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
})

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

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async (req, res) => {
    req.flash('success', 'Succesfully logged in, welcome!');
    res.redirect('/campgrounds');
}))

module.exports = router;