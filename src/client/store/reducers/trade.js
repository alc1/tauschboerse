import {
    TRADE_FETCHED,
    TRADE_FETCHING,
    TRADE_NOT_FOUND,
    TRADE_ARTICLES_SAVED,
    TRADE_ARTICLES_FETCHED,
    TRADE_ARTICLE_TOGGLED,
    TRADE_STEP_INDEX_SET,
    TRADE_EDITOR_INITIALISED,
    TRADE_ARTICLE_FILTER_TEXT_SET
} from '../actions/trade';

export const initialState = {
    trade: null,
    notFound: false,
    stepIndex: 0,
    userArticleFilterText: '',
    partnerArticleFilterText: '',
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
        case TRADE_EDITOR_INITIALISED:
            return {
                ...theState,
                stepIndex: 0,
                userArticleFilterText: '',
                partnerArticleFilterText: ''
            };

        case TRADE_ARTICLE_FILTER_TEXT_SET:
            return {
                ...theState,
                userArticleFilterText: theAction.forUser ? theAction.text : theState.userArticleFilterText,
                partnerArticleFilterText: theAction.forUser ? theState.partnerArticleFilterText : theAction.text
            };

        case TRADE_STEP_INDEX_SET:
            return {
                ...theState,
                stepIndex: theAction.stepIndex
            };

        case TRADE_ARTICLE_TOGGLED:
            return {
                ...theState,
                chosenPartnerArticles: theAction.forUser ? theState.chosenPartnerArticles : toggleArticle(theAction.article, theState.chosenPartnerArticles),
                chosenUserArticles: theAction.forUser ? toggleArticle(theAction.article, theState.chosenUserArticles) : theState.chosenUserArticles
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

        case TRADE_ARTICLES_FETCHED:
            return {
                ...theState,
                partnerArticles: theAction.articles,
                userArticles: theAction.articles
            };

        default:
            return theState;
    }
}
