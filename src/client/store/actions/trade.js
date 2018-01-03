import axios from 'axios';

import { handleError } from './common';
import TradeState from '../../../shared/constants/TradeState';
import TradeModel from '../../model/TradeModel';

/*
 * Action Type Constants
 */

export const TRADE_FETCHED = 'TRADE_FETCHED';
export const TRADE_SAVED = 'TRADE_SAVED';
export const TRADE_STATE_CHANGED = 'TRADE_STATE_CHANGED';

export const TRADE_USER_ARTICLES_FETCHED = 'TRADE_USER_ARTICLES_FETCHED';
export const TRADE_PARTNER_ARTICLES_FETCHED = 'TRADE_PARTNER_ARTICLES_FETCHED';

export const TRADE_EDITING_USER_ARTICLES_STARTED = 'TRADE_EDITING_USER_ARTICLES_STARTED';
export const TRADE_EDITING_PARTNER_ARTICLES_STARTED = 'TRADE_EDITING_PARTNER_ARTICLES_STARTED';
export const TRADE_EDITING_USER_ARTICLES_CANCELED = 'TRADE_EDITING_USER_ARTICLES_CANCELED';
export const TRADE_EDITING_PARTNER_ARTICLES_CANCELED = 'TRADE_EDITING_PARTNER_ARTICLES_CANCELED';
export const TRADE_USER_ARTICLES_SAVED = 'TRADE_USER_ARTICLES_SAVED';
export const TRADE_PARTNER_ARTICLES_SAVED = 'TRADE_PARTNER_ARTICLES_SAVED';

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

const userArticlesFetched = (theArticles) => ({
    type: TRADE_USER_ARTICLES_FETCHED,
    articles: theArticles
});

const partnerArticlesFetched = (theArticles) => ({
    type: TRADE_PARTNER_ARTICLES_FETCHED,
    articles: theArticles
});

const editingUserArticlesStarted = () => ({
    type: TRADE_EDITING_USER_ARTICLES_STARTED
});

const editingPartnerArticlesStarted = () => ({
    type: TRADE_EDITING_PARTNER_ARTICLES_STARTED
});

const editingUserArticlesCanceled = () => ({
    type: TRADE_EDITING_USER_ARTICLES_CANCELED
});

const editingPartnerArticlesCanceled = () => ({
    type: TRADE_EDITING_PARTNER_ARTICLES_CANCELED
});

/*
 * Thunk Actions
 */

export const loadTrade = (theTradeId, theUser) => dispatch => {
    return axios.get(`/api/trades/${theTradeId}`)
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, theUser))))
        .catch(err => handleError(err, dispatch));
};

export const loadUserArticles = (theUserId) => dispatch => {
    return loadArticlesByUserId(theUserId, userArticlesFetched, dispatch);
};

export const loadPartnerArticles = (theUserId) => dispatch => {
    return loadArticlesByUserId(theUserId, partnerArticlesFetched, dispatch);
};

export const saveTrade = (theTrade) => dispatch => {
    // dispatch(lastSearchCleared());
};

export const saveUserArticles = (theTrade) => dispatch => {

};

export const savePartnerArticles = (theTrade) => dispatch => {

};

export const startEditingUserArticles = (theUserId, loadArticles) => dispatch => {
    dispatch(editingUserArticlesStarted());
    return true;
};

export const startEditingPartnerArticles = (theUserId, loadArticles) => dispatch => {
    return startEditingArticles(theUserId, loadArticles, editingPartnerArticlesStarted, dispatch);
};

export const cancelEditingUserArticles = () => dispatch => {
    dispatch(editingUserArticlesCanceled());
    return true;
};

export const cancelEditingPartnerArticles = () => dispatch => {
    dispatch(editingPartnerArticlesCanceled());
    return true;
};

export const toggleUserArticle = (theArticle) => dispatch => {
};

export const togglePartnerArticle = (theArticle) => dispatch => {
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

function loadArticlesByUserId(theUserId, actionCreator, dispatch) {
    return axios.get(`/api/users/${theUserId}/articles`)
        .then(response => dispatch(actionCreator(response.data.articles)))
        .catch(err => handleError(err, dispatch));
}

function startEditingArticles(theUserId, loadArticles, actionCreator, dispatch) {
    if (loadArticles) {
        return loadArticlesByUserId(theUserId, actionCreator, dispatch);
    } else {
        dispatch(actionCreator(null));
        return Promise.resolve(null);
    }
};
