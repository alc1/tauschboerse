import axios from 'axios';

/*
 * Action Type Constants
 */

export const ARTICLE_FETCHED = 'ARTICLE_FETCHED';
export const ARTICLE_CREATED = 'ARTICLE_CREATED';

/*
 * Action Creators
 */

const articleFetched = (theArticle) => ({
    type: ARTICLE_FETCHED,
    article: theArticle
});

const articleCreated = (theArticle) => ({
    type: ARTICLE_CREATED,
    article: theArticle
});

/*
 * Thunk Actions
 */

export const loadArticle = (theArticleId) => dispatch =>
    axios.get(`/api/articles/${theArticleId}`)
        .then(response => dispatch(articleFetched(response.data.article)));

export const createArticle = (title, description, categories) => dispatch =>
    axios.post('/api/articles', { article: { title, description, categories } })
        .then(response => dispatch(articleCreated(response.data.article)));
