const utils = require('../utils/businessUtils');

class Category {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'name', obj, null);
            utils.transferId(obj, this);
        } else {
            this.name = null;
        }
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'name', obj) || modified;

        return modified;
    }

    canSave() {
        return (this.name != null);
    }
}

module.exports = Category;