const utils = require('../utils/modelUtils');

class User {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'gender', obj, null);
            utils.setValue(this, 'email', obj, null);
            utils.setValue(this, 'name', obj, null);
            utils.setValue(this, 'address', obj, null);
            utils.setValue(this, 'registration', obj, new Date());
            utils.setValue(this, 'currentPassword', obj, null);
            utils.setValue(this, 'newPassword', obj, null);
            utils.setValue(this, 'passwordConfirmation', obj, null);

            utils.transferId(obj, this);
        } else {
            this.gender = null;
            this.email = null;
            this.name = null;
            this.address = null;
            this.registration = new Date();
            this.currentPassword = null;
            this.newPassword = null;
            this.passwordConfirmation = null;
        }
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'gender', obj, null) || modified;
        modified = utils.updateValue(this, 'email', obj, null) || modified;
        modified = utils.updateValue(this, 'name', obj, null) || modified;
        modified = utils.updateValue(this, 'address', obj, null) || modified;
        modified = utils.updateValue(this, 'registration', obj, null) || modified;

        return modified;
    }
}

module.exports = User;