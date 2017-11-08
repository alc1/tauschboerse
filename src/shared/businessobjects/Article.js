const utils = require('../utils/businessUtils');

const STATUS_FREE = 'FREE';

class Article {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'title', obj, null);
            utils.setValue(this, 'description', obj, null);

            utils.setValue(this, 'categories', obj, []);
            if (!this.categories) {
                this.categories = [];
            }

            utils.setValue(this, 'photos', obj, []);
            if (!this.photos) {
                this.photos = [];
            }

            utils.setValue(this, 'owner', obj, null);
            utils.setValue(this, 'created', obj, new Date());
            utils.setValue(this, 'status', obj, STATUS_FREE);
        } else {
            this.title = null;
            this.description = null;
            this.categories = [];
            this.photos = [];
            this.owner = null;
            this.created = new Date();
            this.status = STATUS_FREE;
        }
    }

    update(obj) {
        utils.updateValue(this, 'title', obj);
        utils.updateValue(this, 'description', obj);
        utils.updateValue(this, 'categories', obj);
        utils.updateValue(this, 'photos', obj);
        utils.updateValue(this, 'owner', obj);
        utils.updateValue(this, 'created', obj);
        utils.updateValue(this, 'status', obj);
        return true;

        // TODO:
        // This pattern does not work since as soon as a property has been updated,
        // the following properties will not be updated because 'modified' is already true
        // and the rest of the will not be executed.
        /*let modified = false;

        modified = modified || utils.updateValue(this, 'title', obj);
        modified = modified || utils.updateValue(this, 'description', obj);
        modified = modified || utils.updateValue(this, 'categories', obj);
        modified = modified || utils.updateValue(this, 'photos', obj);
        modified = modified || utils.updateValue(this, 'owner', obj);
        modified = modified || utils.updateValue(this, 'created', obj);
        modified = modified || utils.updateValue(this, 'status', obj);

        return modified;*/
    }

    canSave() {
        return (this.title != null);
    }

    sortCategories() {
        this.categories.sort((a, b) => a._id.localeCompare(b._id));
    }
}

module.exports = Article;
