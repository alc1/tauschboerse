const utils = require('../utils/businessUtils');

class Offer {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'sender', obj, null);
            utils.setValue(this, 'receiver', obj, null);
        } else {
            this.name = null;
        }
    }

    update(obj) {
        let modified = false;

        modified = modified || utils.updateValue(this, 'sender', obj, null);
        modified = modified || utils.updateValue(this, 'receiver', obj, null);
        
        return modified;
    }

    canSave() {
        return (this.name != null);
    }
}

module.exports = {
    Offer
};