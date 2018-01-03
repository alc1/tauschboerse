import {
    TRADE_FETCHED,
    TRADE_SAVED,
    TRADE_STATE_CHANGED,
    TRADE_USER_ARTICLES_FETCHED,
    TRADE_PARTNER_ARTICLES_FETCHED,
    TRADE_EDITING_PARTNER_ARTICLES_CANCELED,
    TRADE_EDITING_PARTNER_ARTICLES_STARTED,
    TRADE_EDITING_USER_ARTICLES_CANCELED,
    TRADE_EDITING_USER_ARTICLES_STARTED
} from '../actions/trade';

export const initialState = {
    trade: null,
    userArticles: {
        all: null,
        chosen: [],
        currentlyChosen: [],
        isEditing: false
    },
    partnerArticles: {
        all: null,
        chosen: [],
        currentlyChosen: [],
        isEditing: false
    }
};

export default function trade(theState = initialState, theAction) {
    switch (theAction.type) {
        case TRADE_EDITING_PARTNER_ARTICLES_CANCELED:
            return {
                ...theState,
                partnerArticles: {
                    ...theState.partnerArticles,
                    chosen: theState.partnerArticles.currentlyChosen,
                    isEditing: false
                }
            };

        case TRADE_EDITING_PARTNER_ARTICLES_STARTED:
            return {
                ...theState,
                partnerArticles: {
                    ...theState.partnerArticles,
                    chosen: theState.partnerArticles.chosen.slice(),
                    isEditing: true
                }
            };

        case TRADE_EDITING_USER_ARTICLES_CANCELED:
            return {
                ...theState,
                userArticles: {
                    ...theState.userArticles,
                    chosen: theState.userArticles.currentlyChosen,
                    isEditing: false
                }
            };

        case TRADE_EDITING_USER_ARTICLES_STARTED:
            return {
                ...theState,
                userArticles: {
                    ...theState.userArticles,
                    chosen: theState.userArticles.chosen.slice(),
                    isEditing: true
                }
            };

        case TRADE_FETCHED:
            return {
                ...theState,
                trade: theAction.trade,
                userArticles: {
                    ...theState.userArticles,
                    chosen: theAction.trade.userArticles,
                    currentlyChosen: theAction.trade.userArticles
                },
                partnerArticles: {
                    ...theState.partnerArticles,
                    chosen: theAction.trade.tradePartnerArticles,
                    currentlyChosen: theAction.trade.tradePartnerArticles,
                    all: (theState.trade == null) || (theState.trade.tradePartner._id === theAction.trade.tradePartner._id) ? theState.partnerArticles.all : null
                }
            };

        case TRADE_SAVED:
        case TRADE_STATE_CHANGED:
            return {
                ...theState,
                trade: theAction.trade,
                userArticles: {
                    ...theState.userArticles,
                    chosen: theAction.trade.userArticles,
                    currentlyChosen: theAction.trade.userArticles
                },
                partnerArticles: {
                    ...theState.partnerArticles,
                    chosen: theAction.trade.tradePartnerArticles,
                    currentlyChosen: theAction.trade.tradePartnerArticles
                }
            };

        case TRADE_PARTNER_ARTICLES_FETCHED:
            return {
                ...theState,
                partnerArticles: {
                    ...theState.partnerArticles,
                    all: theAction.articles
                }
            };

        case TRADE_USER_ARTICLES_FETCHED:
            return {
                ...theState,
                userArticles: {
                    ...theState.userArticles,
                    all: theAction.articles
                }
            };

        default:
            return theState;
    }
}
