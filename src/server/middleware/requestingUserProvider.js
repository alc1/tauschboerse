/*
 * This middleware always adds the user from the requesting token to the request object.
 * If there is no token or verifying the token fails, no user will be added.
 * But this middleware will always pass.
 */
'use strict';

const jwt = require('jsonwebtoken');

const dataCache = require('../services/DataCache').dataCache;

module.exports = (req, res, next) => {
    let token;
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (!err) {
                let user = dataCache.getUserById(decoded._id);
                if (user) {
                    req.user = user;
                }
            }
            next();
        });
    }
    else {
        next()
    }
};
