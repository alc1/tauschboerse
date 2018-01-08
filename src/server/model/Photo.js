const utils = require('../utils/modelUtils');

class Photo {
    constructor(obj, theArticleId) {
        if (obj) {
            utils.setValue(this, 'fileName', obj, null);
            utils.setValue(this, 'isMain', obj, false);
            utils.setValue(this, 'url', obj, `/images/article/${theArticleId}/${obj.fileName}`);
        } else {
            this.fileName = null;
            this.isMain = false;
            this.url = null;
        }
    }
}

module.exports = Photo;
