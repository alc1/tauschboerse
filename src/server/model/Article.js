const utils = require('../utils/modelUtils');

const ArticleStatus = require('../../shared/constants/ArticleStatus');

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
            utils.setValue(this, 'status', obj, ArticleStatus.STATUS_FREE);

            utils.transferId(obj, this);
        } else {
            this.title = null;
            this.description = null;
            this.categories = [];
            this.photos = [];
            this.owner = null;
            this.created = new Date();
            this.status = ArticleStatus.STATUS_FREE;
        }
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'title', obj) || modified;
        modified = utils.updateValue(this, 'description', obj) || modified;
        modified = utils.updateValue(this, 'categories', obj) || modified;
        modified = utils.updateValue(this, 'photos', obj) || modified;
        modified = utils.updateValue(this, 'owner', obj) || modified;
        modified = utils.updateValue(this, 'created', obj) || modified;
        modified = utils.updateValue(this, 'status', obj) || modified;

        return modified;
    }

    sortCategories() {
        this.categories.sort((category1, category2) => category1.name.localeCompare(category2.name));
    }
}

module.exports = Article;
