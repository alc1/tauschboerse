/*
 * This middleware always adds the user from the requesting token to the request object.
 * If there is no token or verifying the token fails, no user will be added.
 * But this middleware will always pass.
 */
'use strict';

const tokenUtils = require('../utils/tokenUtils');
const dataCache = require('../services/DataCache').dataCache;

module.exports = (req, res, next) => {
    let token = tokenUtils.getTokenFromRequest(req);
    if (token) {
        tokenUtils.verify(token, (err, decoded) => {
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
        next();
    }
};
