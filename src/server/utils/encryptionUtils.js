'use strict';

const encryptionService = require('crypto');

function encrypt(thePlainText) {
    return encryptionService.createHmac('sha256', process.env.ENCRYPTION_KEY).update(thePlainText).digest('hex');
}

function compare(thePlainText, theEncryptedText) {
    return encrypt(thePlainText) === theEncryptedText;
}

module.exports = {
    encrypt,
    compare
};
