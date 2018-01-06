/*
 * This middleware checks that the user from the authentication token
 * (user which is logged in) is the same as the user of the requested
 * resource (user from the URL).
 */
'use strict';

module.exports = (req, res, next) => {
    const requestedUserId = req.params.userId;
    const tokenUser = req.user;
    if (tokenUser && tokenUser._id === requestedUserId) {
        next();
    }
    else {
        res.status(403).json({ globalError: 'Fehlende Berechtigung für diesen Benutzer!' });
    }
};
