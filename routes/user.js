const express = require('express');
const router = express.Router();
const User = require('../models/user');

const jwt = require('jsonwebtoken');

const DBIMGPATH = 'assets/uploads';
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var secret = 'super secret';


module.exports = function (passport) { 

    router.post('/register', function (req, res) {

        var user = new User();
        user.reqID = req.body.reqID;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.password = req.body.password;
        user.status = true;
        user.createdDateTime = new Date() 


        User.createUser(user, function (err, user) {
            if (err) return res.json({ err, status: 'error' });

            if (user) {
                return res.json({
                    status: 1,
                    message: 'User is created..',
                    user
                });
            } else {

                return res.json({
                    status: 0,
                    message: 'User is not created..',
                    user
                });
            }
        });
    }); 

    router.post('/login', function (req, res, next) {
       
        passport.authenticate("local", function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    code: 'unauthorized'
                });
            } else {        
                jwt.sign({user}, secret, (err, token) => {
                    res.json({
                        token:token,
                        user:user
                    });                   
                });         
            
            }
        })(req, res, next);
        
    });
   
    //Verify Token
    function verifyToken(req, res, next) {

        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            //Forbidden
            res.status(403);
        }
    }

    return router;
};