const utils = require('../utils/businessUtils');

const TradeStatus = require('./TradeStatus');

class Trade {
    constructor(obj) {
        if (obj) {
            utils.setValue(this, 'user1', obj, null);
            utils.setValue(this, 'user2', obj, null);
            utils.setValue(this, 'state', obj, TradeStatus.TRADE_STATUS_INIT);
            utils.setValue(this, 'createDate', obj, new Date());
            utils.setValue(this, 'versionstamp', obj, undefined);
            utils.setValue(this, 'offers', obj, []);

            utils.transferId(obj, this);
        } else {
            this.user1 = null;
            this.user2 = null;
            this.state = TradeStatus.TRADE_STATUS_INIT;
            this.createDate = new Date();
            this.offers = [];
        }
    }

    update(obj) {
        let modified = false;

        modified = utils.updateValue(this, 'user1', obj) || modified;
        modified = utils.updateValue(this, 'user2', obj) || modified;
        modified = utils.updateValue(this, 'state', obj) || modified;
        modified = utils.updateValue(this, 'createDate', obj) || modified;
        modified = utils.updateValue(this, 'offers', obj) || modified;
        
        utils.updateValue(this, 'versionstamp', obj);

        return modified;
    }

    canSave() {
        return (this.user1 != null) && (this.user2 != null) && (this.user1 !== this.user2);
    }
}

module.exports = Trade;