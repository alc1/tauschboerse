const TradeState = require('../../shared/businessobjects/TradeState');
const OfferState = require('../../shared/businessobjects/OfferState');

class TradeModel {
    constructor (trade, user) {
        this.trade = trade;
        this.user = user;

        this._userArticles = null;
        this._tradePartnerArticles = null;
    }

    get _id() {
        return this.trade._id;
    }

    get isFinished() {
        return (this.trade.state === TradeState.TRADE_STATE_COMPLETED) || (this.trade.state === TradeState.TRADE_STATE_CANCELED);
    }

    get isNew() {
        return (this.trade.state === TradeState.TRADE_STATE_INIT) && (this.currentOffer.state === OfferState.OFFER_STATE_INIT);
    }

    get hasMadeCurrentOffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (this.currentOffer.sender === this.user);
    }

    get hasCounteroffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.trade.offers.length > 1) && (this.trade.offers[0].state === OfferState.OFFER_STATE_INIT);
    }

    get currentOffer() {
        return this.trade.offers[this.hasCounteroffer ? 1 : 0];
    }

    get counterOffer() {
        return this.hasCounteroffer ? this.trade.offers[0] : null;
    }

    get canEditOffer() {
        return false;
    }

    get canSubmitOffer() {
        return ((this.trade.state === TradeState.TRADE_STATE_INIT) && this.isUserSender)
            || ((this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && this.hasCounteroffer && this.isUserReceiver);
    }

    get tradePartner() {
        return this.isUser(this.trade.user1) ? this.trade.user2 : this.trade.user1;
    }

    get canWithdrawOffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && this.isUserSender;
    }

    get canMakeCounteroffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && this.isUserReceiver;
    }

    get canAcceptOffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && this.isUserReceiver;
    }

    get canDeclineOffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && this.isUserReceiver;
    }

    get isUserSender() {
        return this.isUser(this.currentOffer.sender);
    }

    get isUserReceiver() {
        return !this.isUser(this.currentOffer.sender);
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
            this._userArticles = this.currentOffer.articles.filter(article => this.isUser(article.owner));
            this._tradePartnerArticles = this.currentOffer.articles.filter(article => !this.isUser(article.owner));
        }
    }

    isUser(user) {
        return user._id === this.user._id;
    }
}

module.exports = TradeModel;