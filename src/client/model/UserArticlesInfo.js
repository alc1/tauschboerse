import filterArticles from '../../shared/filterArticles';

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

    get isFilteredByStatus() {
        return (typeof this.filterInfo.filterStatus === 'string') && (this.filterInfo.filterStatus.length > 0);
    }

    setFilter(theFilterText, theFilterStatus) {
        this.filterInfo = {
            filterText: theFilterText,
            filterStatus: theFilterStatus
        };

        this.applyFilter();

        return this;
    }

    setArticles(theArticles) {
        this.articles = theArticles || [];

        this.sortArticles(this.articles);
        this.applyFilter();

        return this;
    }

    updateArticle(theArticle) {
        let theArticleId = theArticle._id;
        this.articles = this.articles.map(article => (article._id === theArticleId) ? theArticle : article);

        this.sortArticles(this.articles);
        this.applyFilter();

        return this;
    }

    deleteArticle(theArticleId) {
        this.articles = this.articles.filter(article => article._id !== theArticleId);
        this.filteredArticles = this.filteredArticles.filter(article => article._id !== theArticleId);

        return this;
    }

    applyFilter() {
        let relevantArticles = this.isFilteredByStatus ? this.articles : this.articles.filter(article => article.status === this.filterInfo.filterStatus);
        this.filteredArticles = filterArticles(this.filterInfo.filterText, relevantArticles);

        this.sortArticles(this.filteredArticles);
    }

    sortArticles(articles) {
        articles.sort((article1, article2) => article1.title.localeCompare(article2.title));
    }
}