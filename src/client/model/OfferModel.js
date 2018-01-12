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
        this.prepareArticleLists();
        return this._tradePartnerArticles;
    }

    get userArticles() {
        this.prepareArticleLists();
        return this._userArticles;
    }

    prepareArticleLists() {
        if (!this._userArticles) {
            this._userArticles = this.offer.articles.filter(article => this.isUser(article.owner));
            this._tradePartnerArticles = this.offer.articles.filter(article => !this.isUser(article.owner));
        }
    }

    isUser(user) {
        return user._id === this.user._id;
    }
}

module.exports = OfferModel;