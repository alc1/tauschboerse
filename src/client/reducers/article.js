import {
    ARTICLE_FETCHED,
    ARTICLE_CREATED,
    ARTICLE_UPDATED
} from './../actions/article';

const initialState = null;

export default function article(theState = initialState, theAction) {
    switch (theAction.type) {
        case ARTICLE_FETCHED:
        case ARTICLE_CREATED:
        case ARTICLE_UPDATED:
            return theAction.article;
        default:
            return theState;
    }
}
