import {
    TRADE_FETCHED,
    TRADE_FETCHING,
    TRADE_NOT_FOUND,
    TRADE_SAVED,
    TRADE_ARTICLES_SAVED,
    TRADE_STATE_CHANGED,
    TRADE_USER_ARTICLES_FETCHED,
    TRADE_PARTNER_ARTICLES_FETCHED,
    TRADE_PARTNER_ARTICLE_TOGGLED,
    TRADE_USER_ARTICLE_TOGGLED,
    TRADE_STEP_INDEX_SET
} from '../actions/trade';

export const initialState = {
    trade: null,
    notFound: false,
    userArticles: [],
    partnerArticles: [],
    chosenUserArticles: [],
    chosenPartnerArticles: []
};

function toggleArticle(article, chosenArticles) {
    let idx = chosenArticles.findIndex(a => a._id === article._id);

    let newChosenArticles;

    if (idx < 0) {
        newChosenArticles = [
            ...chosenArticles,
            article
        ];
    } else {
        newChosenArticles = [
            ...chosenArticles.slice(0, idx),
            ...chosenArticles.slice(idx + 1)
        ];
    }

    return newChosenArticles;
}

export default function trade(theState = initialState, theAction) {
    switch (theAction.type) {
        case TRADE_STEP_INDEX_SET:
            return {
                ...theState,
                stepIndex: theAction.stepIndex
            };

        case TRADE_PARTNER_ARTICLE_TOGGLED:
            return {
                ...theState,
                chosenPartnerArticles: toggleArticle(theAction.article, theState.chosenPartnerArticles)
            };

        case TRADE_USER_ARTICLE_TOGGLED:
            return {
                ...theState,
                chosenUserArticles: toggleArticle(theAction.article, theState.chosenUserArticles)
            };

        case TRADE_FETCHING:
            return {
                ...theState,
                trade: null,
                notFound: false
            };

        case TRADE_FETCHED:
            return {
                ...theState,
                trade: theAction.trade,
                chosenUserArticles: theAction.trade.userArticles.slice(),
                chosenPartnerArticles: theAction.trade.tradePartnerArticles.slice()
            };

        case TRADE_NOT_FOUND:
            return {
                ...theState,
                notFound: true
            };

        case TRADE_ARTICLES_SAVED:
            return {
                ...theState
            }

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
                partnerArticles: theAction.articles
            };

        case TRADE_USER_ARTICLES_FETCHED:
            return {
                ...theState,
                userArticles: theAction.articles
            };

        default:
            return theState;
    }
}
