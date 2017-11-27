'use strict';

const encryptionService = require('bcrypt');

function encrypt(thePlainText) {
    return encryptionService.hashSync(thePlainText, 10);
}

function compare(thePlainText, theEncryptedText) {
    return encryptionService.compareSync(thePlainText, theEncryptedText);
}

module.exports = {
    encrypt,
    compare
};
