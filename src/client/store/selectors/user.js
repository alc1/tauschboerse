import { USER_SLICE_NAME } from '../slices';

import TradesModel from '../../model/TradesModel';

const initialUser = null;
const initialUserTrades = [];
const initialUserArticles = [];
const initialUserArticlesFilter = {
    filterText: '',
    filterStatus: ''
};
const initialUserTradesSectionIndex = -1;

export const getUserArticles = (theState) => {
    return sortUserArticles(getUserArticlesInternal(theState));
};

export const getFilteredUserArticles = (theState) => {
    const filteredArticles = filterArticles(getUserArticlesInternal(theState), getUserArticlesFilter(theState));
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

const filterArticles = (theArticles, theUserArticlesFilter) => {
    if (!theUserArticlesFilter) {
        return theArticles;
    }
    return theArticles.filter(article =>
        (isMatchingFilterText(article.title, theUserArticlesFilter.filterText)
            || isMatchingFilterText(article.description, theUserArticlesFilter.filterText)
            || isMatchingFilterText(article.categories ? article.categories.map(category => category.name).join(', ') : '', theUserArticlesFilter.filterText)) &&
        (isMatchingFilterStatus(article.status, theUserArticlesFilter.filterStatus)));
};

const isMatchingFilterText = (theText, theFilterText) => {
    if (!theFilterText || theFilterText === '') {
        return true;
    }
    else if (!theText) {
        return false;
    }
    return theText.toUpperCase().includes(theFilterText.toUpperCase());
};

const isMatchingFilterStatus = (theStatus, theFilterStatus) => {
    if (!theFilterStatus || theFilterStatus === '') {
        return true;
    }
    return theStatus === theFilterStatus;
};

const sortUserArticles = (theArticles) => {
    return theArticles.sort((article1, article2) => article1.title.localeCompare(article2.title))
};
