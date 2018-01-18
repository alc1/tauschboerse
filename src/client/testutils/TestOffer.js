import OfferState from '../../shared/constants/OfferState';

export default class TestOffer {
    constructor(user) {
        this.sender = user;
        this.state = OfferState.OFFER_STATE_INIT;
        this.articles = [];
    }

    setState(state) {
        this.state = state;
        return this;
    }

    setArticles(articles) {
        this.articles = articles;
        return this;
    }

    addArticle(article) {
        this.articles.push(article);
        return this;
    }
}