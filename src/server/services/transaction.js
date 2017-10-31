const storageUtils = require('../utils/storageUtils');

class Transaction {
    constructor(obj) {
        if (obj) {
            storageUtils.setValue(this, 'name', obj, null);
        } else {
            this.name = null;
        }
    }

    update(obj) {
        modified = false;

        modified = modified || storageUtils.updateValue(this, 'name', obj, null);

        return modified;
    }

    canSave() {
        return (this.name != null);
    }
}

module.exports = {
    Transaction
};