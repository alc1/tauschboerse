const utils = require('../utils/businessUtils');

class User {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'email', obj, null);
            utils.setValue(this, 'name', obj, null);
            utils.setValue(this, 'password', obj, null);
        } else {
            this.email = null;
            this.name = null;
            this.password = null;
        }
        this.registration = new DateTime();
    }

    update(obj) {
        let modified = false;

        modified = modified || utils.updateValue(this, 'email', obj, null);
        modified = modified || utils.updateValue(this, 'name', obj, null);
        modified = modified || utils.updateValue(this, 'password', obj, null);

        return modified;
    }

    canSave() {
        return (this.email != null) && (this.name != null) && (this.password != null);
    }
}

module.exports = User;