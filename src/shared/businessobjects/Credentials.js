const utils = require('../utils/businessUtils');

class Credentials {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'currentPassword', obj, null);
            utils.setValue(this, 'newPassword', obj, null);
            utils.setValue(this, 'passwordConfirmation', obj, null);
        } else {
            this.currentPassword = null;
            this.newPassword = null;
            this.passwordConfirmation = null;
        }
    }
}

module.exports = Credentials;
