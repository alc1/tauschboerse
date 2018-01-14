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
            utils.setValue(this, 'pageSize', obj, 20);

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
            this.pageSize = 20;
        }
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'gender', obj) || modified;
        modified = utils.updateValue(this, 'email', obj) || modified;
        modified = utils.updateValue(this, 'name', obj) || modified;
        modified = utils.updateValue(this, 'address', obj) || modified;
        modified = utils.updateValue(this, 'registration', obj) || modified;
        modified = utils.updateValue(this, 'pageSize', obj) || modified;

        return modified;
    }
}

module.exports = User;