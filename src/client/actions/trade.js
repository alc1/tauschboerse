import axios from 'axios';

import { handleError } from './common';

/*
 * Action Type Constants
 */

export const TRADE_FETCHED = 'TRADE_FETCHED';
export const TRADE_SAVED = 'TRADE_SAVED';

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

/*
 * Thunk Actions
 */

export const loadTrade = (theTradeId) => dispatch => {
    return axios.get(`/api/trades/${theTradeId}`)
        .then(response => dispatch(tradeFetched(response.data.trade)))
        .catch(err => handleError(err, dispatch));
}

export const saveTrade = (theTrade) => dispatch => {
    // dispatch(lastSearchCleared());
}