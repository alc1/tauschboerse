const TradeState = require('../../shared/businessobjects/TradeState');
const OfferState = require('../../shared/businessobjects/OfferState');

class TradeModel {
    constructor (trade, user) {
        this.trade = trade;
        this.user = user;
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
        return ((this.trade.state === TradeState.TRADE_STATE_INIT) && (this.currentOffer.sender === this.user))
            || ((this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (this.currentOffer.sender === this.user));
    }

    get tradePartner() {
        return (this.trade.user1 === this.user) ? this.trade.user2 : this.trade.user1;
    }

    get canWithdrawOffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (this.currentOffer.sender === this.user);
    }

    get canMakeCounteroffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (this.currentOffer.sender !== this.user);
    }

    get canAcceptOffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (this.currentOffer.sender !== this.user);
    }

    get canDeclineOffer() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && (this.currentOffer.sender !== this.user);
    }

    get isUserSender() {
        return this.currentOffer.sender === this.user;
    }

    get isUserReceiver() {
        return this.currentOffer.sender !== this.user;
    }
}

module.exports = TradeModel;