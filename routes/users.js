const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/users');
var atob = require('atob');
//Register'


router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(req.body, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'failed to register user' });
        }
        else {
            res.json({ success: true, msg: 'user registered' });
        }
    });
});
//Authenticate
router.post('/authenticate', (req, res, next) => {
   
    console.log(req.body);
    //const auth = atob(req.body.auth).split(':');
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, (err, user) => {
        if (err) { 
            throw err 
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
     
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 604800 //1week in secs
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                    }
                })
            }
            else {
                return res.json({
                    success: false,
                    msg: 'wrong password'
                });
            }
        });

    });
});
//profile 
router.get('/status', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});
//change password
router.post('/change_password', (req, res, next) => {
    console.log('body', req.body);
    const auth = atob(req.body.auth).split(':');
    console.log('auth', auth[0]);
    const username = auth[0];
    const password = auth[1];
    const newPassword = atob(req.body.newPassword);
    console.log(newPassword);
    User.getUserByUsername(username, (err, user) => {
        if (err) {
            throw err
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                console.log('isMatch', isMatch);
                let newUser = new User({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: newPassword
                });
                User.changePassword(newUser,  (err, user) => {
                    if (err) {
                        return res.json({ sucess: false, msg: 'failed to change password' });

                    }
                    else {
                        return res.json({ sucess: true, msg: 'password change sucess' });
                    }
                });
            }
            else {
                return res.json({
                    sucess: false,
                    msg: 'wrong password'
                });
            }
        });

    });
});

module.exports = router;
