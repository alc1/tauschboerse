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
            utils.setValue(this, 'created', obj, null);
            utils.setValue(this, 'status', obj, null);
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
        let modified = false;

        modified = modified || utils.updateValue(this, 'title', obj);
        modified = modified || utils.updateValue(this, 'description', obj);
        modified = modified || utils.updateValue(this, 'categories', obj);
        modified = modified || utils.updateValue(this, 'photos', obj);
        modified = modified || utils.updateValue(this, 'owner', obj);
        modified = modified || utils.updateValue(this, 'created', obj);
        modified = modified || utils.updateValue(this, 'status', obj);

        return modified;
    }

    canSave() {
        return (this.title != null);
    }

    sortCategories() {
        this.categories.sort((a, b) => a._id.localeCompare(b._id));
    }
}

module.exports = Article;
