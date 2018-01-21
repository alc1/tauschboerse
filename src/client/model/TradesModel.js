const TradeModel = require('./TradeModel');

class TradesModel {    
    constructor(trades, user) {
        this.__trades = trades ? trades.map(trade => new TradeModel(trade, user)) : [];

        this.__newTrades = null;
        this.__openTrades = null;
        this.__completedTrades = null;
        this.__canceledTrades = null;
        this.__tradesRequiringAttention = null;
        this.__openTradesNotRequiringAttention = null;

        this.__highestVersionstamp = -1;
    }

    get count() {
        return this.__trades.length;
    }

    get allTrades() {
        return this.__trades;
    }

    get newTrades() {
        if (this.__newTrades === null) {
            this.__newTrades = this.__trades.filter(trade => trade.isNew);
        }
        return this.__newTrades;
    }

    get openTrades() {
        if (this.__openTrades === null) {
            this.__openTrades = this.__trades.filter(trade => trade.isOpen);
        }
        return  this.__openTrades;
    }

    get completedTrades() {
        if (this.__completedTrades === null) {
            this.__completedTrades = this.__trades.filter(trade => trade.isCompleted);
        }
        return this.__completedTrades;
    }

    get canceledTrades() {
        if (this.__canceledTrades === null) {
            this.__canceledTrades = this.__trades.filter(trade => trade.isCanceled);
        }
        return this.__canceledTrades;
    }

    get tradesRequiringAttention() {
        if (this.__tradesRequiringAttention === null) {
            this.__tradesRequiringAttention = this.__trades.filter(trade => trade.requiresAttention);
        }
        return this.__tradesRequiringAttention;
    }

    get openTradesNotRequiringAttention() {
        if (this.__openTradesNotRequiringAttention === null) {
            this.__openTradesNotRequiringAttention = this.__trades.filter(trade => trade.openButDoesNotRequireAttention);
        }
        return this.__openTradesNotRequiringAttention;
    }

    get hasNewTrades() {
        return this.newTrades.length > 0;
    }

    get hasCompletedTrades() {
        return this.completedTrades.length > 0;
    }

    get hasCanceledTrades() {
        return this.canceledTrades.length > 0;
    }

    get hasTradesRequiringAttention() {
        return this.tradesRequiringAttention.length > 0;
    }

    get hasOpenTradesNotRequiringAttention() {
        return this.openTradesNotRequiringAttention.length > 0;
    }

    get highestVersionstamp() {
        if (this.__highestVersionstamp < 0) {
            this.__highestVersionstamp = this.__trades.reduce((highest, trade) => Math.max(trade.versionstamp, highest), 0);
        }

        return this.__highestVersionstamp;
    }
}

module.exports = TradesModel;