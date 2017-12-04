'use strict';

const dataCache = require('../services/DataCache').dataCache;

function getTradesByUser(req, res) {
    const { userId } = req.params;
    let trades = dataCache.getTradesByUser(userId);
    res.json({ trades: trades });
}

function getTrades(req, res) {
    res.json({ trades: dataCache.getAllTrades() });
}

function getTrade(req, res) {
    const { tradeId } = req.params;
    let trade = findTrade(tradeId);
    if (trade) {
        res.json({ trade: trade });
    } else {
        res.sendStatus(404);
    }
}

function findTrade(id, userId) {
    let trade = dataCache.getTrade(id);
    if (trade) {
        if ((trade.user1Id !== userId) && (trade.user2Id !== userId)) {
            trade = undefined;
        }
    }

    return trade;
}

module.exports = {
    getTradesByUser,
    getTrades,
    getTrade
};
