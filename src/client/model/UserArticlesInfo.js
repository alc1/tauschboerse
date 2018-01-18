import filterArticles from '../../shared/filterArticles';
import { isValidArticleStatus } from '../../shared/constants/ArticleStatus';

export default class UserArticlesInfo {
    constructor(info) {
        if (typeof info === 'undefined') {
            this.articles = [];
            this.filteredArticles = [];
            this.filterInfo = {
                filterText: '',
                filterStatus: ''
            };
        } else {
            this.articles = info.articles;
            this.filteredArticles = info.filteredArticles;
            this.filterInfo = info.filterInfo;
        }
    }

    setFilter(theFilterText, theFilterStatus) {
        theFilterText = theFilterText || '';
        theFilterStatus = theFilterStatus || '';

        if (typeof theFilterText !== 'string') {
            throw new Error('filterText must be a string');
        }
        if (!isValidArticleStatus(theFilterStatus) && ((typeof theFilterStatus !== 'string') || (theFilterStatus.length > 0))) {
            throw new Error(`${theFilterStatus} is not a valid ArticleStatus`);
        }

        this.filterInfo = {
            filterText: theFilterText,
            filterStatus: theFilterStatus
        };

        this.applyFilter();

        return this;
    }

    setArticles(theArticles) {
        theArticles = theArticles || [];

        if (!Array.isArray(theArticles)) {
            throw new Error('setArticles() requires an array of articles');
        }

        this.articles = theArticles;

        this.sortArticles(this.articles);
        this.applyFilter();

        return this;
    }

    updateArticle(theArticle) {
        if (!theArticle || (typeof theArticle !== 'object')) {
            throw new Error('updateArticle requires an object (article)');
        }
        if (typeof theArticle._id === 'undefined') {
            throw new Error('updateArticle requires an article with an id');
        }

        let theArticleId = theArticle._id;
        this.articles = this.articles.map(article => (article._id === theArticleId) ? theArticle : article);

        this.sortArticles(this.articles);
        this.applyFilter();

        return this;
    }

    deleteArticle(theArticleId) {
        if ((typeof theArticleId === 'undefined') || (theArticleId === null) || (theArticleId === '')) {
            throw new Error('deleteArticle requires a value for the id of the article to delete');
        }

        this.articles = this.articles.filter(article => article._id !== theArticleId);
        this.filteredArticles = this.filteredArticles.filter(article => article._id !== theArticleId);

        return this;
    }

    applyFilter() {
        let relevantArticles = this.isFilteredByStatus ? this.articles.filter(article => article.status === this.filterInfo.filterStatus) : this.articles;
        this.filteredArticles = filterArticles(this.filterInfo.filterText, relevantArticles);

        this.sortArticles(this.filteredArticles);
    }

    sortArticles(articles) {
        articles.sort((article1, article2) => article1.title.localeCompare(article2.title));
    }

    get isFilteredByStatus () {
        return this.filterInfo.filterStatus.length > 0;
    }
}