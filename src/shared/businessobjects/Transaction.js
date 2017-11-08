const utils = require('../utils/businessUtils');

class Transaction {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'user1', obj, null);
            utils.setValue(this, 'user2', obj, null);
        } else {
            this.user1 = null;
            this.user2 = null;
        }
    }

    update(obj) {
        let modified = false;

        modified = modified || utils.updateValue(this, 'user1', obj, null);
        modified = modified || utils.updateValue(this, 'user2', obj, null);
        
        return modified;
    }

    canSave() {
        return (this.name != null);
    }
}

module.exports = Transaction;