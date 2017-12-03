import {
    ARTICLES_FOUND
} from './../actions/marketplace';

const initialState = null;

export default function marketplace(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLES_FOUND:
            return {...theState, lastSearch: { text: theAction.text, articles: theAction.articles, version: theAction.version }};
        default:
            return theState;
    }
}
