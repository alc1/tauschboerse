export default class SearchInfo {
    constructor(searchInfo) {
        if (typeof(searchInfo) === 'undefined') {
            this.hasSearched = false;
            this.text = '';
            this.articles = [];
            this.userArticles = [];
        } else {
            this.hasSearched = searchInfo.hasSearched;
            this.text = searchInfo.text;
            this.articles = searchInfo.articles;
            this.userArticles = searchInfo.userArticles;
        }
    }

    clear() {
        this.hasSearched = false;
        this.text = '';
        this.articles = [];
        this.userArticles = [];

        return this;
    }

    setSearchResults(theText, theArticles, theUserArticles) {
        this.hasSearched = true;
        this.text = theText;
        this.articles = theArticles;
        this.userArticles = theUserArticles;

        return this;
    }
}