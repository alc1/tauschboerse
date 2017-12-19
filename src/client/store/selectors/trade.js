import { TRADE_SLICE_NAME } from '../slices';

export const getTrades = (theState) => {
    return theState[TRADE_SLICE_NAME].trades;
};

export const getTrade = (theState) => {
    return theState[TRADE_SLICE_NAME].trade;
};

export const getUserArticles = (theState) => {
    return theState[TRADE_SLICE_NAME].userArticles;
};

export const getPartnerArticles = (theState) => {
    return theState[TRADE_SLICE_NAME].parterArticles;
};