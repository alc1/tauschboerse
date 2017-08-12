import $ from 'jquery';

export const SET_USER_ARTICLES = 'SET_USER_ARTICLES';
export const SET_ARTICLE = 'SET_ARTICLE';

export function loadUserArticles(theUserId) {
    return (dispatch) => {
        const request = ajaxRequest('GET', `api/users/${theUserId}/articles`);
        request.done((data) => {
            dispatch({
                type: SET_USER_ARTICLES,
                userArticles: data.articles
            });
        })
    };
}

export function loadArticle(theArticleId) {
    return (dispatch) => {
        const request = ajaxRequest('GET', `api/articles/${theArticleId}`);
        request.done((data) => {
            dispatch({
                type: SET_ARTICLE,
                article: data.article
            });
        })
    };
}

function ajaxRequest(theMethod, theUrlPath, theData) {
    return $.ajax({
        method : theMethod,
        url : 'http://localhost:3001/' + theUrlPath,
        dataType : 'json',
        contentType : 'application/json',
        data : JSON.stringify(theData)
    });
}
