const TradeStatus = require('../../shared/businessobjects/TradeStatus');

class TradeModel {
    constructor (trade) {
        this.trade = trade;
    }

    get isFinished() {
        return (this.trade.state === TradeStatus.TRADE_STATUS_COMPLETED) || (this.trade.state === TradeStatus.TRADE_STATUS_CANCELED);
    }

    get _id() {
        return this.trade._id;
    }
}

module.exports = TradeModel;