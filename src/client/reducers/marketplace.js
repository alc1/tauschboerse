import {
    ARTICLES_FOUND, LAST_SEARCH_CLEARED, TRADE_CREATED
} from './../actions/marketplace';

const initialState = {};

export default function marketplace(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLES_FOUND:
            return {...theState, lastSearch: { text: theAction.text, articles: theAction.articles, version: theAction.version }};
        case LAST_SEARCH_CLEARED:
            return {...theState, lastSearch: undefined };
        case TRADE_CREATED:
            return {...theState, trade: theAction.trade };
        default:
            return theState;
    }
}
