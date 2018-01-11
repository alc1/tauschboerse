import { USER_SLICE_NAME } from '../slices';

import TradesModel from '../../model/TradesModel';
import filterArticles from '../../../shared/filterArticles';

const initialUser = null;
const initialUserTrades = [];
const initialUserArticles = [];
const initialUserArticlesFilter = {
    filterText: '',
    filterStatus: ''
};
const initialUserTradesSectionIndex = -1;

export const getUserArticles = (theState) => sortUserArticles(getUserArticlesInternal(theState));

export const getFilteredUserArticles = (theState) => {
    const filteredArticles = applyArticleFilter(getUserArticlesInternal(theState), getUserArticlesFilter(theState));
    return sortUserArticles(filteredArticles);
};

export const getUserTrades = (theState) => {
    return theState[USER_SLICE_NAME] ? theState[USER_SLICE_NAME].trades || initialUserTrades : initialUserTrades;
};

export const getUser = (theState) => {
    return theState[USER_SLICE_NAME] ? theState[USER_SLICE_NAME].user : initialUser;
};

export const getUserId = (theState) => {
    const user = getUser(theState);
    return user ? user._id : null;
};

export const getUserArticlesFilter = (theState) => {
    return theState[USER_SLICE_NAME] ? theState[USER_SLICE_NAME].userArticlesFilter || initialUserArticlesFilter : initialUserArticlesFilter;
};

export const getUserTradesSectionIndex = (theState) => {
    const trades = new TradesModel(getUserTrades(theState), getUser(theState));
    return getCurrentUserTradesSectionIndex(theState, trades.hasNewTrades, trades.hasReceivedTrades, trades.hasSentTrades, trades.hasCompletedTrades, trades.hasCanceledTrades);
};

const getCurrentUserTradesSectionIndex = (theState, hasNewTrades, hasReceivedTrades, hasSentTrades, hasCompletedTrades, hasCanceledTrades) => {
    let storedUserTradesSectionIndex = theState[USER_SLICE_NAME] ? theState[USER_SLICE_NAME].userTradesSectionIndex : null;
    if (typeof storedUserTradesSectionIndex === 'number') {
        return storedUserTradesSectionIndex;
    }
    else if (hasReceivedTrades) {
        return 1;
    }
    else if (hasNewTrades) {
        return 0;
    }
    else if (hasSentTrades) {
        return 2;
    }
    else if (hasCompletedTrades) {
        return 3;
    }
    else if (hasCanceledTrades) {
        return 4;
    }
    else {
        return initialUserTradesSectionIndex;
    }
};

const getUserArticlesInternal = (theState) => {
    return theState[USER_SLICE_NAME] && theState[USER_SLICE_NAME].articles ? theState[USER_SLICE_NAME].articles : initialUserArticles;
};

const applyArticleFilter = (theArticles, theUserArticlesFilter) => {
    if (!theUserArticlesFilter) {
        return theArticles;
    }

    let relevantArticles = (!theUserArticlesFilter.filterStatus || (theUserArticlesFilter.filterStatus === '')) ? theArticles : theArticles.filter(article => article.status === theUserArticlesFilter.filterStatus);
    return filterArticles(theUserArticlesFilter.filterText, relevantArticles);
};

const sortUserArticles = (theArticles) => {
    return theArticles.sort((article1, article2) => article1.title.localeCompare(article2.title));
};
