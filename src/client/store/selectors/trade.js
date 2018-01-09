import { TRADE_SLICE_NAME } from '../slices';

export const getTrades = (theState) => theState[TRADE_SLICE_NAME].trades;

export const getTrade = (theState) => theState[TRADE_SLICE_NAME].trade;

export const getUserArticles = (theState) => theState[TRADE_SLICE_NAME].userArticles;

export const getPartnerArticles = (theState) => theState[TRADE_SLICE_NAME].partnerArticles;

export const getChosenUserArticles = (theState) => theState[TRADE_SLICE_NAME].chosenUserArticles;

export const getChosenPartnerArticles = (theState) => theState[TRADE_SLICE_NAME].chosenPartnerArticles;

export const getStepIndex = (theState) => theState[TRADE_SLICE_NAME].stepIndex;

export const getUserArticleFilterText = (theState) => theState[TRADE_SLICE_NAME].userArticleFilterText;

export const getPartnerArticleFilterText = (theState) => theState[TRADE_SLICE_NAME].partnerArticleFilterText;

export const getFilteredUserArticles = (theState) => theState[TRADE_SLICE_NAME].filteredUserArticles;

export const getFilteredPartnerArticles = (theState) => theState[TRADE_SLICE_NAME].filteredPartnerArticles;