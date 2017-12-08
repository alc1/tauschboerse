const utils = require('../utils/businessUtils');
const OfferState = require('./OfferState');

class Offer {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'trade', obj, null);
            utils.setValue(this, 'sender', obj, null);
            utils.setValue(this, 'articles', obj, []);
            utils.setValue(this, 'createDate', obj, null);
            utils.setValue(this, 'state', obj, null);

            utils.transferId(obj, this);
        } else {
            this.trade = null;
            this.sender = null;
            this.articles = [];
            this.createDate = new Date();
            this.state = OfferState.OFFER_STATE_INIT;
        }
    }

    update(obj) {
        return utils.updateValue(this, 'articles', obj);
    }

    canSave() {
        return (this.trade != null)
            && (this.sender != null)
            && ((this.trade.user1 === this.sender) || (this.trade.user2 === this.sender))
            && this.articles.every(article => ((article.owner === this.trade.user1) || (article.owner === this.trade.user2)));
    }
}

module.exports = Offer;