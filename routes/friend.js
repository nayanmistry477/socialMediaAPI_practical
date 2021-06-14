const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var secret = 'super secret';
const Friend = require('../models/friend');
const User = require('../models/user');

module.exports = function (passport) { 

    router.post('/addFriend', verifyToken, function (req, res, next) {

        jwt.verify(req.token, secret, function (err, user) {
            if (err) {
                return res.status(403);
            } else {
                var id = new Friend();
                id.fromID = user.user._id; 
                id.toID = req.body.toID;
                id.status="pending";
                Friend.addFriend(id, function (err, user) {
                    if (err) return res.json({ err, status: 'error' });
                    // if (err) throw err;
                    if (user) {
                        return res.json({
                            status: 1,
                            message: 'Request Sent..',
                            user
                        });
                    } else {
                        return res.json({
                            status: 0,
                            message: 'Request Not Sent..',

                        });
                    }
                });

            }
        });


    });

    router.post('/acceptFriend', verifyToken, function (req, res, next) {

        jwt.verify(req.token, secret, function (err, user) {
            if (err) {
                return res.status(403);
            } else {
                var id = new Friend();
                id.fromID = user.user._id; 
                id.toID = req.body.toID;
                id.status="accepted";
                Friend.acceptFriend(id, function (err, user) {
                    if (err) return res.json({ err, status: 'error' });
                    // if (err) throw err;
                    if (user) {
                        return res.json({
                            status: 1,
                            message: 'Request Accepted..',
                            user
                        });
                    } else {
                        return res.json({
                            status: 0,
                            message: 'Request Not Accepted..',

                        });
                    }
                });

            }
        });


    });

    router.post('/getAllRequestByID', verifyToken, function (req, res, next) {

        jwt.verify(req.token, secret, function (err, user) {
            if (err) {
                return res.status(403);
            } else {
                var id = req.body.toID
                User.getAllRequestByID(id, function (err, user) {
                    if (err) throw err;
                    if (user) {
                        return res.json(user);
                    }
                });
            }
        });


    });

    router.get('/getAllAccepted', verifyToken, function (req, res, next) {

        jwt.verify(req.token, secret, function (err, user) {
            if (err) {
                return res.status(403);
            } else { 
                Friend.getAllAccepted(function (err, user) {
                    if (err) throw err;
                    if (user) {
                        return res.json(user);
                    }
                });
            }
        });


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
}