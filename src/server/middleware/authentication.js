/*
 * This middleware checks that the authorization token is available in the request
 * and the corresponding user exists.
 */
'use strict';

const jwt = require('jsonwebtoken');

const usersStore = require('../services/usersStorage');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;

module.exports = (req, res, next) => {
    let token;
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                res.status(401).json({ globalError: 'Token zur Authentifizierung ungültig! Bitte erneut anmelden.' });
            }
            else {
                let user;
                if (useDataCache) {
                    user = dataCache.getUserById(decoded._id);
                } else {
                    user = await usersStore.getUserById(decoded._id);
                }

                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    res.status(401).json({ globalError: 'Token zur Authentifizierung ungültig! Bitte erneut anmelden.' });
                }
            }
        });
    }
    else {
        res.status(403).json({ globalError: 'Kein Token zur Authentifizierung gefunden! Bitte anmelden.' });
    }
};
