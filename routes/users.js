const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const { storeReturnTo } = require('../middleware');

const router = express.Router();

//get register page
router.get('/register', (req, res) => {
    res.render('users/register');
})

//create new user
router.post('/register', storeReturnTo, catchAsync(async (req, res, next) => {
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success', `Welcome to CampSage ${username}`);
            const redirectUrl = res.locals.returnTo || '/campgrounds';
            res.redirect(redirectUrl);
        })
        
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
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),(req, res) => {
    req.flash('success', 'Succesfully logged in, welcome!');
    let redirectUrl = res.locals.returnTo || '/campgrounds';

    if(redirectUrl.endsWith('DELETE')) redirectUrl = '/campgrounds';
    delete req.session.returnTo;

    res.redirect(redirectUrl);
})

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