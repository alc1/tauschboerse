import { TRADE_SLICE_NAME } from '../slices';

export const getTrades = (theState) => {
    return theState[TRADE_SLICE_NAME].trades;
};

export const getTrade = (theState) => {
    return theState[TRADE_SLICE_NAME].trade;
};

export const getUserArticles = (theState) => {
    console.log('getUserArticles');
    return theState[TRADE_SLICE_NAME].userArticles;
};

export const getPartnerArticles = (theState) => {
    console.log('getPartnerArticles');
    return theState[TRADE_SLICE_NAME].partnerArticles;
};

export const getChosenUserArticles = (theState) => {
    return theState[TRADE_SLICE_NAME].chosenUserArticles;
};

export const getChosenPartnerArticles = (theState) => {
    return theState[TRADE_SLICE_NAME].chosenPartnerArticles;
};

export const getStepIndex = (theState) => {
    return theState[TRADE_SLICE_NAME].stepIndex;
}

export const getUserArticleFilterText = (theState) => {
    return theState[TRADE_SLICE_NAME].userArticleFilterText;
}

export const getPartnerArticleFilterText = (theState) => {
    return theState[TRADE_SLICE_NAME].partnerArticleFilterText;
}
