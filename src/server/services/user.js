const storageUtils = require('../utils/storageUtils');

class User {
    constructor(obj) {
        if (obj) {
            storageUtils.setValue(this, 'email', obj, null);
            storageUtils.setValue(this, 'name', obj, null);
            storageUtils.setValue(this, 'password', obj, null);
        } else {
            this.email = null;
            this.name = null;
            this.password = null;
        }
        this.registration = new DateTime();
    }

    update(obj) {
        modified = false;

        modified = modified || storageUtils.updateValue(this, 'email', obj, null);
        modified = modified || storageUtils.updateValue(this, 'name', obj, null);
        modified = modified || storageUtils.updateValue(this, 'password', obj, null);

        return modified;
    }

    canSave() {
        return (this.email != null) && (this.name != null) && (this.password != null);
    }
}

module.exports = {
    User
};