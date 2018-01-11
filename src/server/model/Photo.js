const utils = require('../utils/modelUtils');

class Photo {
    constructor(theFileName, theMain, theArticleId) {
        this.fileName = theFileName;
        this.isMain = theMain;
        this.url = `/images/article/${theArticleId}/${theFileName}`;
    }
}

module.exports = Photo;
