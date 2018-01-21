/*
 * This middleware checks that the authorization token is available in the request
 * and the corresponding user exists.
 */
'use strict';

const tokenUtils = require('../utils/tokenUtils');
const dataCache = require('../services/DataCache').dataCache;

module.exports = (req, res, next) => {
    let token = tokenUtils.getTokenFromRequest(req);
    if (token) {
        tokenUtils.verify(token, (err, decoded) => {
            if (err) {
                res.status(401).json({ globalError: 'Token zur Authentifizierung ungültig! Bitte erneut anmelden.' });
            }
            else {
                let user = dataCache.getUserById(decoded._id);
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
        res.status(401).json({ globalError: 'Kein Token zur Authentifizierung gefunden! Bitte anmelden.' });
    }
};
