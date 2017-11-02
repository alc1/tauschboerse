const utils = require('../utils/businessUtils');

class Category {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'name', obj, null);
        } else {
            this.name = null;
        }
    }

    update(obj) {
        let modified = false;

        modified = modified || utils.updateValue(this, 'name', obj, null);

        return modified;
    }

    canSave() {
        return (this.name != null);
    }
}

module.exports = {
    Category
};