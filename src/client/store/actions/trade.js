import axios from 'axios';

import { handleError } from './common';
import TradeState from '../../../shared/constants/TradeState';
import TradeModel from '../../model/TradeModel';

/*
 * Action Type Constants
 */

export const TRADE_FETCHED = 'TRADE_FETCHED';
export const TRADE_FETCHING = 'TRADE_FETCHING';
export const TRADE_NOT_FOUND = 'TRADE_NOT_FOUND';
export const TRADE_SAVED = 'TRADE_SAVED';
export const TRADE_ARTICLES_SAVED = 'TRADE_ARTICLES_SAVED';
export const TRADE_STATE_CHANGED = 'TRADE_STATE_CHANGED';
export const TRADE_USER_ARTICLES_FETCHED = 'TRADE_USER_ARTICLES_FETCHED';
export const TRADE_PARTNER_ARTICLES_FETCHED = 'TRADE_PARTNER_ARTICLES_FETCHED';
export const TRADE_PARTNER_ARTICLE_TOGGLED = 'TRADE_PARTNER_ARTICLE_TOGGLED';
export const TRADE_USER_ARTICLE_TOGGLED = 'TRADE_USER_ARTICLE_TOGGLED';
export const TRADE_STEP_INDEX_SET = 'TRADE_STEP_INDEX_SET';

/*
 * Action Creators
 */

const tradeFetched = (theTrade) => ({
    type: TRADE_FETCHED,
    trade: theTrade,
});

const tradeIsBeingFetched = () => ({
    type: TRADE_FETCHING
});

const tradeNotFound = () => ({
    type: TRADE_NOT_FOUND
});

const tradeSaved = (theTrade) => ({
    type: TRADE_SAVED,
    trade: theTrade
});

const articlesSaved = (theTrade) => ({
    type: TRADE_ARTICLES_SAVED,
    trade: theTrade
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

const userArticleToggled = (theArticle) => ({
    type: TRADE_USER_ARTICLE_TOGGLED,
    article: theArticle
});

const partnerArticleToggled = (theArticle) => ({
    type: TRADE_PARTNER_ARTICLE_TOGGLED,
    article: theArticle
});

const stepIndexSet = (stepIndex) => ({
    type: TRADE_STEP_INDEX_SET,
    stepIndex: stepIndex
});

/*
 * Thunk Actions
 */

export const loadTrade = (theTradeId, theUser) => dispatch => {
    dispatch(tradeIsBeingFetched());
    return axios.get(`/api/trades/${theTradeId}`)
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, theUser))))
        .catch(err => {
            handleError(err, dispatch);
            return dispatch(tradeNotFound());
        });
};

export const loadNewTrade = (theArticleId, theUser) => dispatch => {
    dispatch(tradeIsBeingFetched());
    return axios.get(`/api/trades/new/${theArticleId}`)
        .then(
            response => dispatch(tradeFetched(new TradeModel(response.data.trade, theUser)))
         )
        .catch((err) => {
            handleError(err, dispatch);
            return dispatch(tradeNotFound());
        });
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

export const saveArticles = (theTradeId, theArticles) => dispatch => {
    return axios.put(`/api/trades/${theTradeId}`, theArticles.map(a => a._id))
        .then(response => dispatch(articlesSaved(new TradeModel(response.data))))
        .catch(err => handleError(err, dispatch));
};

export const toggleUserArticle = (theArticle) => dispatch => {
    dispatch(userArticleToggled(theArticle));
};

export const togglePartnerArticle = (theArticle) => dispatch => {
    dispatch(partnerArticleToggled(theArticle));
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

export const setStepIndex = (theStepIndex) => dispatch => {
    return dispatch(stepIndexSet(theStepIndex));
}

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
