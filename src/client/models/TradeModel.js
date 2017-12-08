const TradeState = require('../../shared/businessobjects/TradeState');

class TradeModel {
    constructor (trade) {
        this.trade = trade;
    }

    get isFinished() {
        return (this.trade.state === TradeState.TRADE_STATE_COMPLETED) || (this.trade.state === TradeState.TRADE_STATE_CANCELED);
    }

    get _id() {
        return this.trade._id;
    }
}

module.exports = TradeModel;