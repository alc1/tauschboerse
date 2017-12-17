const TradeModel = require('./TradeModel');

class TradesModel {    
    constructor(trades, user) {
        this.__trades = trades ? trades.map(trade => new TradeModel(trade, user)) : [];

        this.__newTrades = null;
        this.__openTrades = null;
        this.__completedTrades = null;
        this.__canceledTrades = null;
        this.__finishedTrades = null;
        this.__sentTrades = null;
        this.__receivedTrades = null;
    }

    get count() {
        return this.__trades.length;
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

    get finishedTrades() {
        if (this.__finishedTrades === null) {
            this.__finishedTrades = this.__trades.filter(trade => trade.isFinished);
        }
        return this.__finishedTrades;
    }

    get sentTrades() {
        if (this.__sentTrades === null) {
            this.__sentTrades = this.__trades.filter(trade => trade.hasMadeCurrentOffer);
        }
        return this.__sentTrades;
    }

    get receivedTrades() {
        if (this.__receivedTrades === null) {
            this.__receivedTrades = this.__trades.filter(trade => trade.hasReceivedCurrentOffer);
        }
        return this.__receivedTrades;
    }
}

module.exports = TradesModel;