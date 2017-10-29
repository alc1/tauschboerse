import axios from 'axios';

/*
 * Action Type Constants
 */

export const ARTICLE_FETCHED = 'ARTICLE_FETCHED';

/*
 * Action Creators
 */

const articleFetched = (theArticle) => ({
    type: ARTICLE_FETCHED,
    article: theArticle
});

/*
 * Thunk Actions
 */

export const loadArticle = (theArticleId) => dispatch =>
    axios.get(`/api/articles/${theArticleId}`)
        .then(response => dispatch(articleFetched(response.data.article)));
