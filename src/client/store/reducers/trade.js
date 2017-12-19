import {
    TRADE_FETCHED,
    TRADE_SAVED,
    TRADE_STATE_CHANGED,
    TRADE_USER_ARTICLES_FETCHED,
    TRADE_PARTNER_ARTICLES_FETCHED
} from '../actions/trade';

export const initialState = {};

export default function trade(theState = initialState, theAction) {
    switch (theAction.type) {
        case TRADE_FETCHED:
        case TRADE_SAVED:
        case TRADE_STATE_CHANGED:
            return {
                ...theState,
                trade: theAction.trade
            };
        case TRADE_USER_ARTICLES_FETCHED:
            return {
                ...theState,
                userArticles: theAction.articles
            };
        case TRADE_PARTNER_ARTICLES_FETCHED:
            return {
                ...theState,
                partnerArticles: theAction.articles
            };
        default:
            return theState;
    }
}
