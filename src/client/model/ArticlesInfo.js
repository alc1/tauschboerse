import filterArticles from '../../shared/filterArticles';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

export default class ArticlesInfo {
    constructor(articlesInfo) {
        if (typeof articlesInfo === 'undefined') {
            this.articles = [];
            this.filterText = '';
            this.filteredArticles = [];
            this.pageSize = DEFAULT_PAGE_SIZE;
            this.pageNum = 1;
            this.pageCount = 1;
            this.visibleArticles = [];
            this.chosenArticles = [];
            this.availableArticles = [];
        } else {
            this.articles = articlesInfo.articles;
            this.filterText = articlesInfo.filterText;
            this.filteredArticles = articlesInfo.filteredArticles;
            this.pageSize = articlesInfo.pageSize;
            this.pageNum = articlesInfo.pageNum;
            this.pageCount = articlesInfo.pageCount;
            this.visibleArticles = articlesInfo.visibleArticles;
            this.chosenArticles = articlesInfo.chosenArticles;
            this.availableArticles = articlesInfo.availableArticles;
        }
    }

    get hasOnlyOneChosenArticle() {
        return this.chosenArticles.length === 1;
    }

    setArticles(articles) {
        this.articles = articles.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        this.updateAvailableArticles();

        return this;
    }

    setChosenArticles(articles) {
        this.chosenArticles = articles;
        this.updateAvailableArticles();

        return this;
    }

    setFiltertext(text) {
        this.filterText = text;
        this.updateFilteredArticles();

        return this;
    }

    setPageSize(val) {
        this.pageSize = val;
        this.updatePageCount();
        this.updateVisibleArticles();

        return this;
    }

    setPageNum(val) {
        if (val < 1) {
            val = 1;
        } else if (val > this.pageCount) {
            val = this.pageCount;
        }

        this.pageNum = val;
        this.updateVisibleArticles();

        return this;
    }

    toggleArticle(theArticle) {
        let idx = this.chosenArticles.findIndex(article => article._id === theArticle._id);
    
        if (idx < 0) {
            this.chosenArticles = [
                ...this.chosenArticles,
                theArticle
            ];
        } else {
            this.chosenArticles = [
                ...this.chosenArticles.slice(0, idx),
                ...this.chosenArticles.slice(idx + 1)
            ];
        }
    
        this.updateAvailableArticles();

        return this;
    }

    updatePageCount() {
        this.pageCount = Math.floor(this.filteredArticles.length / this.pageSize);
        if (((this.filteredArticles.length % this.pageSize) > 0) || (this.pageCount === 0)) {
            this.pageCount++;
        }

        if (this.pageNum > this.pageCount) {
            this.pageNum = this.pageCount;
        }
    }

    updateAvailableArticles() {
        this.availableArticles = this.articles.filter(article => !this.chosenArticles.some(a => a._id === article._id));
        this.updateFilteredArticles();
    }

    updateFilteredArticles() {
        this.filteredArticles = (this.filterText.length > 0) ? filterArticles(this.filterText, this.availableArticles) : this.availableArticles;
        this.updatePageCount();
        this.updateVisibleArticles();
    }

    updateVisibleArticles() {
        let startIdx = (this.pageNum - 1) * this.pageSize;
        this.visibleArticles = this.filteredArticles.slice(startIdx, startIdx + this.pageSize);
    }
}