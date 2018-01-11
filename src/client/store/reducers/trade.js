import {
    TRADE_FETCHED,
    TRADE_FETCHING,
    TRADE_NOT_FOUND,
    TRADE_DELETED,
    TRADE_ARTICLES_SAVED,
    TRADE_ARTICLES_FETCHED,
    TRADE_ARTICLE_TOGGLED,
    TRADE_STEP_INDEX_SET,
    TRADE_EDITOR_INITIALISED,
    TRADE_ARTICLE_FILTER_TEXT_SET
} from '../actions/trade';

import filterArticles from '../../../shared/filterArticles';

export const initialState = {
    trade: null,
    notFound: false,
    stepIndex: 0,
    userArticleFilterText: '',
    partnerArticleFilterText: '',
    userArticles: [],
    partnerArticles: [],
    chosenUserArticles: [],
    chosenPartnerArticles: [],
    filteredUserArticles: [],
    filteredPartnerArticles: []
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

function filterAndSortArticles(text, articles) {
    let filteredArticles = (text.length > 0) ? filterArticles(text, articles) : articles.slice();

    return filteredArticles.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
}

export default function trade(theState = initialState, theAction) {
    let newState;

    switch (theAction.type) {
        case TRADE_EDITOR_INITIALISED:
            return {
                ...theState,
                stepIndex: 0,
                userArticleFilterText: '',
                partnerArticleFilterText: '',
                filteredUserArticles: filterAndSortArticles('', theState.userArticles),
                filteredPartnerArticles: filterAndSortArticles('', theState.partnerArticles)
            };

        case TRADE_ARTICLE_FILTER_TEXT_SET:
            newState = { ...theState };

            if (theAction.forUser) {
                newState.userArticleFilterText = theAction.text;
                newState.filteredUserArticles = filterAndSortArticles(theAction.text, theState.userArticles);
            } else {
                newState.partnerArticleFilterText = theAction.text;
                newState.filteredPartnerArticles = filterAndSortArticles(theAction.text, theState.partnerArticles);
            }

            return newState;

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

        case TRADE_DELETED:
            return {
                ...theState,
                trade: null,
                notFound: true,
                chosenUserArticles: [],
                chosenPartnerArticles: [],
            };

        case TRADE_ARTICLES_SAVED:
            return {
                ...theState
            }

        case TRADE_ARTICLES_FETCHED:
            newState = { ...theState };

            if (theAction.forUser) {
                newState.userArticles = theAction.articles;
                newState.filteredUserArticles = filterAndSortArticles(theState.userArticleFilterText, theAction.articles);
            } else {
                newState.partnerArticles = theAction.articles;
                newState.filteredPartnerArticles = filterAndSortArticles(theState.partnerArticleFilterText, theAction.articles);
            }

            return newState;

        default:
            return theState;
    }
}
