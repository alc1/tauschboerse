import axios from 'axios';

import { handleError } from './common';
import TradeState from '../../../shared/businessobjects/TradeState'

/*
 * Action Type Constants
 */

export const TRADE_FETCHED = 'TRADE_FETCHED';
export const TRADE_SAVED = 'TRADE_SAVED';
export const TRADE_STATE_CHANGED = 'TRADE_STATE_CHANGED';

/*
 * Action Creators
 */

const tradeFetched = (theTrade) => ({
    type: TRADE_FETCHED,
    trade: theTrade,
});

const tradeSaved = (theTrade) => ({
    type: TRADE_SAVED,
    trade: theTrade,
});

const tradeStateChanged = (theTrade) => ({
    type: TRADE_STATE_CHANGED,
    trade: theTrade
});

/*
 * Thunk Actions
 */

export const loadTrade = (theTradeId) => dispatch => {
    return axios.get(`/api/trades/${theTradeId}`)
        .then(response => dispatch(tradeFetched(response.data.trade)))
        .catch(err => handleError(err, dispatch));
};

export const saveTrade = (theTrade) => dispatch => {
    // dispatch(lastSearchCleared());
};

export const submitTrade = (theTrade) => dispatch => {
    return setTradeState(theTrade, 'REQUESTED', dispatch);
};

export const withdrawTrade = (theTrade) => dispatch => {
    
};

export const acceptTrade = (theTrade) => dispatch => {
    return setTradeState(theTrade, 'ACCEPTED', dispatch);
};

export const declineTrade = (theTrade) => dispatch => {
    return setTradeState(theTrade, 'DECLINED', dispatch);
};

function setTradeState(theTrade, theNewState, dispatch) {
    return axios.put(`/api/trades/${theTrade._id}/state`, { newState: theNewState })
        .then(response => dispatch(tradeStateChanged(response.data.trade)))
        .catch(err => handleError(err, dispatch));
}