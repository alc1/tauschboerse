'use strict';

const jwt = require('jsonwebtoken');

const AUDIENCE = 'self';
const ISSUER = 'tauschboerse';

function sign(theData) {
    return jwt.sign(theData, process.env.JWT_KEY, { expiresIn: '1h', audience: AUDIENCE, issuer: ISSUER });
}

function verify(theToken, theCallback) {
    jwt.verify(theToken, process.env.JWT_KEY, { audience: AUDIENCE, issuer: ISSUER }, theCallback);
}

function getTokenFromRequest(theRequest) {
    let token;
    const authorizationHeader = theRequest.headers['authorization'];
    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }
    return token;
}

module.exports = {
    sign,
    verify,
    getTokenFromRequest
};
