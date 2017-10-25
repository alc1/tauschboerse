/*
 * This middleware checks that the authorization token is available in the request
 * and the corresponding user exists.
 */
'use strict';

const jwt = require('jsonwebtoken');

const config = require('../config');
const usersStore = require('../services/usersStorage');

module.exports = (req, res, next) => {
    let token;
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, async (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Unauthorized (authentication failed)!' });
            }
            else {
                const user = await usersStore.getUserById(decoded._id);
                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    res.status(404).json({ error: 'User from token not found' });
                }
            }
        });
    }
    else {
        res.status(403).json({ error: 'Forbidden (no token provided)!' });
    }
};
