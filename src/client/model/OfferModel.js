const ArticleStatus = require('../../shared/constants/ArticleStatus');

class OfferModel {
    constructor(offer, user) {
        this.offer = offer;
        this.user = user;

        this._userArticles = null;
        this._tradePartnerArticles = null;
    }

    get articles() {
        return this.offer.articles;
    }

    get createDate() {
        return this.offer.createDate;
    }

    get sender() {
        return this.offer.sender;
    }

    get state() {
        return this.offer.state;
    }

    get tradePartnerArticles() {
        if (!this._tradePartnerArticles) {
            this._tradePartnerArticles = this.offer.articles.filter(article => !this.isUser(article.owner));
        }
        return this._tradePartnerArticles;
    }

    get userArticles() {
        if (!this._userArticles) {
            this._userArticles = this.offer.articles.filter(article => this.isUser(article.owner));
        }
        return this._userArticles;
    }

    get isValid() {
        return this.articles.every(article => (article.status === ArticleStatus.STATUS_FREE) || (article.status === ArticleStatus.STATUS_DEALING)) && (this.userArticles.length > 0) && (this.tradePartnerArticles.length > 0);
    }

    isUser(user) {
        return user._id === this.user._id;
    }
}

module.exports = OfferModel;