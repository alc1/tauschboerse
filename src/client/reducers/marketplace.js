import {
    ARTICLES_FOUND, LAST_SEARCH_CLEARED
} from './../actions/marketplace';

const initialState = null;

export default function marketplace(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLES_FOUND:
            return {...theState, lastSearch: { text: theAction.text, articles: theAction.articles, version: theAction.version }};
        case LAST_SEARCH_CLEARED:
            return {...theState, lastSearch: undefined };
        default:
            return theState;
    }
}
