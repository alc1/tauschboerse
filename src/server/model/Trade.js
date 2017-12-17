const utils = require('../utils/modelUtils');

const TradeState = require('../../shared/constants/TradeState');
const Offer = require('./Offer');

class Trade {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'user1', obj, null);
            utils.setValue(this, 'user2', obj, null);
            utils.setValue(this, 'state', obj, TradeState.TRADE_STATE_INIT);
            utils.setValue(this, 'createDate', obj, new Date());
            utils.setValue(this, 'versionstamp', obj, undefined);
            utils.setValue(this, 'offers', obj, []);
            utils.setValue(this, 'user1HasDelivered', obj, false);
            utils.setValue(this, 'user2HasDelivered', obj, false);

            utils.transferId(obj, this);
        } else {
            this.user1 = null;
            this.user2 = null;
            this.state = TradeState.TRADE_STATE_INIT;
            this.createDate = new Date();
            this.offers = [];
            this.user1HasDelivered = false;
            this.user2HasDelivered = false;
        }
    }

    get currentOffer() {
        return this.offers[0];
    }

    addOffer(sender, articles) {
        let offer = new Offer();
        offer.sender = sender;
        offer.articles = articles;

        this.offers.unshift(offer);

        return offer;
    }

    setArticles(articles) {
        this.currentOffer.articles = articles;
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'user1', obj) || modified;
        modified = utils.updateValue(this, 'user2', obj) || modified;
        modified = utils.updateValue(this, 'state', obj) || modified;
        modified = utils.updateValue(this, 'createDate', obj) || modified;
        modified = utils.updateValue(this, 'offers', obj) || modified;
        modified = utils.updateValue(this, 'user1HasDelivered', obj) || modified;
        modified = utils.updateValue(this, 'user2HasDelivered', obj) || modified;
        
        utils.updateValue(this, 'versionstamp', obj);

        return modified;
    }

    canSave() {
        return (this.user1 != null) && (this.user2 != null) && (this.user1 !== this.user2);
    }
}

module.exports = Trade;