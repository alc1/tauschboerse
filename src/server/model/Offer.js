const utils = require('../utils/modelUtils');
const OfferState = require('../../shared/constants/OfferState');

class Offer {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'sender', obj, null);
            utils.setValue(this, 'articles', obj, []);
            utils.setValue(this, 'createDate', obj, null);
            utils.setValue(this, 'state', obj, null);

            utils.transferId(obj, this);
        } else {
            this.sender = null;
            this.articles = [];
            this.createDate = new Date();
            this.state = OfferState.OFFER_STATE_INIT;
        }
    }

    update(obj) {
        return utils.updateValue(this, 'articles', obj);
    }

    hasArticle(theArticleId) {
        return this.articles.find(article => article._id === theArticleId) != null;
    }
}

module.exports = Offer;