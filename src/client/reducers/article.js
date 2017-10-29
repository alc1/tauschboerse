import {
    ARTICLE_FETCHED,
    ARTICLE_CREATED
} from './../actions/article';

const initialState = null;

export default function article(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLE_FETCHED:
        case ARTICLE_CREATED:
            return theAction.article;
        default:
            return theState;
    }
}
