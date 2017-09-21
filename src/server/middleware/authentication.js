const jwt = require('jsonwebtoken');

const config = require('../config');

//const usersStore = require('../services/usersStorage');

module.exports = (req, res, next) => {
    let token;
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Unauthorized (authentication failed)!' });
            }
            else {
                req.userId = decoded._id;
                next();
                /*
                // Fetch user on each request to be sure that the user still exists?
                usersStore.getUser(decoded._id, (err, user) => {
                    if (!user) {
                        res.status(404).json({ error: 'No such user' });
                    } else {
                        req.userId = user._id;
                        next();
                    }
                });
                */
            }
        });
    }
    else {
        res.status(403).json({ error: 'Forbidden (no token provided)!' });
    }
};
