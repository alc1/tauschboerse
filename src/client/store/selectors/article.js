import { ARTICLE_SLICE_NAME } from '../slices';

export const getArticle = (theState) => {
    return theState[ARTICLE_SLICE_NAME];
};
