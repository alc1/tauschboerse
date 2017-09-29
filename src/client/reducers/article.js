import { ARTICLE_FETCHED } from './../actions/article';

const initialState = null;

export default function article(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLE_FETCHED:
            return theAction.article;
        default:
            return theState;
    }
}
