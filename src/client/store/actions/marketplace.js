import axios from 'axios';

import { handleError } from './common';

/*
 * Action Type Constants
 */

export const ARTICLES_FOUND = 'ARTICLES_FOUND';
export const LAST_SEARCH_CLEARED = 'LAST_SEARCH_CLEARED';
export const TRADE_CREATED = 'TRADE_CREATED';
export const MARKETPLACE_SECTION_OPENED = 'MARKETPLACE_SECTION_OPENED';

/*
 * Action Creators
 */

const articlesFound = (theSearchText, theArticles, theVersion) => ({
    type: ARTICLES_FOUND,
    text: theSearchText,
    articles: theArticles,
    version: theVersion
});

const lastSearchCleared = () => ({
    type: LAST_SEARCH_CLEARED
});

const tradeCreated = (theTrade) => ({
    type: TRADE_CREATED,
    trade: theTrade
});

const marketplaceSectionOpened = (theMarketplaceSectionIndex) => ({
    type: MARKETPLACE_SECTION_OPENED,
    marketplaceSectionIndex: theMarketplaceSectionIndex
});

/*
 * Thunk Actions
 */

export const findArticles = (theSearchText, theVersion) => dispatch => {
    let versionCheckPromise = new Promise((resolve, reject) => {
        if (theVersion) {
            axios.get('/api/articles/version')
                .then(response => {
                    resolve(theVersion === Number(response.data.version));
                })
                .catch(() => resolve(true));
        } else {
            resolve(true);
        }
    });

    let searchPromise = new Promise((resolve, reject) => {
        axios.get(`/api/articles?text=${theSearchText}`)
            .then(response => {
                dispatch(articlesFound(theSearchText, response.data.articles, response.data.version));
                resolve();
            })
            .catch((err) => reject(err));
        });

    return versionCheckPromise
        .then(doSearch => {
            if (doSearch) {
                return searchPromise;
            } else {
                return null;
            }
        })
        .catch((err) => handleError(err, dispatch));
};

export const clearLastSearch = () => dispatch =>
    dispatch(lastSearchCleared());

export const createTrade = (theArticle) => dispatch =>
    axios.post('/api/trades', { articleIds: [theArticle._id] })
        .then(response => dispatch(tradeCreated(response.data)))
        .catch(err => handleError(err, dispatch));

export const openMarketplaceSection = (theMarketplaceSectionIndex) => dispatch =>
    dispatch(marketplaceSectionOpened(theMarketplaceSectionIndex));