import { USER_SLICE_NAME } from '../slices';

export const getUserArticles = (theState) => {
    return theState[USER_SLICE_NAME].userArticlesInfo.articles;
};

export const getFilteredUserArticles = (theState) => theState[USER_SLICE_NAME].userArticlesInfo.filteredArticles;

export const getUserTrades = (theState) => theState[USER_SLICE_NAME].trades;

export const getReloadTrades = (theState) => theState[USER_SLICE_NAME].reloadTrades;

export const getUser = (theState) => theState[USER_SLICE_NAME].user;

export const getUserId = (theState) => {
    const user = getUser(theState);
    return user ? user._id : null;
};

export const getUserArticlesFilter = (theState) => theState[USER_SLICE_NAME].userArticlesInfo.filterInfo;

export const getUserTradesSectionIndex = (theState) => theState[USER_SLICE_NAME].userTradesSectionIndex;