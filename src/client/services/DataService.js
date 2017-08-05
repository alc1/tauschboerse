import $ from 'jquery';

class DataService {

    loadUserArticles(theUserId) {
        return this.ajaxRequest('GET', `api/users/${theUserId}/articles`);
    }

    loadArticle(theArticleId) {
        return this.ajaxRequest('GET', `api/articles/${theArticleId}`);
    }

    ajaxRequest(theMethod, theUrlPath, theData) {
        return $.ajax({
            method : theMethod,
            url : 'http://localhost:3001/' + theUrlPath,
            dataType : 'json',
            contentType : 'application/json',
            data : JSON.stringify(theData)
        });
    }
}

export default DataService;
