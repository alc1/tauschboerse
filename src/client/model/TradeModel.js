const TradeState = require('../../shared/constants/TradeState');
const OfferState = require('../../shared/constants/OfferState');
const OfferModel = require('./OfferModel');

class TradeModel {
    constructor (trade, user) {
        this.trade = trade;
        this.user = user;
        this.offers = trade.offers.map(offer => new OfferModel(offer, user));

        // these two fields are fields and not properties / getters for optimisation/acceleration purposes
        this.hasCounteroffer = (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION) && (this.trade.offers.length > 1) && (this.trade.offers[0].state === OfferState.OFFER_STATE_INIT);
        this.currentOffer = this.offers[this.hasCounteroffer ? 1 : 0];
    }

    get _id() {
        return this.trade._id;
    }

    get state() {
        return this.trade.state;
    }

    get createDate() {
        return this.trade.createDate;
    }

    get exists() {
        return (typeof this.trade._id !== 'undefined');
    }

    get isCompleted() {
        return (this.trade.state === TradeState.TRADE_STATE_COMPLETED);
    }

    get isCanceled() {
        return (this.trade.state === TradeState.TRADE_STATE_CANCELED);
    }

    get isFinished() {
        return this.isCompleted || this.isCanceled;
    }

    get isNew() {
        return (this.trade.state === TradeState.TRADE_STATE_INIT) && (this.currentOffer.state === OfferState.OFFER_STATE_INIT);
    }

    get isOpen() {
        return (this.trade.state === TradeState.TRADE_STATE_IN_NEGOTIATION);
    }

    get isDeclined() {
        return this.isOpen && (this.currentOffer.state === OfferState.OFFER_STATE_DECLINED);
    }

    get isInvalidated() {
        return this.isOpen && (this.currentOffer.state === OfferState.OFFER_STATE_INVALIDATED);
    }

    get isMakingCounteroffer() {
        return this.hasCounteroffer && ((this.isUserReceiver && !(this.isDeclined || this.isInvalidated)) || (this.isUserSender && (this.isDeclined || this.isInvalidated)));
    }

    get hasMadeCurrentOffer() {
        return this.isOpen && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && this.isUserSender;
    }

    get hasReceivedCurrentOffer() {
        return this.isOpen && (this.currentOffer.state === OfferState.OFFER_STATE_REQUESTED) && this.isUserReceiver;
    }

    get counterOffer() {
        return this.hasCounteroffer ? this.offers[0] : null;
    }

    get canEditOffer() {
        return (this.isNew && this.isUserSender) || (this.hasReceivedCurrentOffer && this.isMakingCounteroffer);
    }

    get canSubmitOffer() {
        return (this.isNew && this.isUserSender)
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

    get cannotSubmit() {
        return (this.isNew && this.currentOffer.isValid) || (this.isMakingCounteroffer && this.counteroffer.isValid);
    }

    get requiresInputFromUser() {
        return this.hasCounteroffer || this.canMakeCounteroffer;
    }

    get isUserSender() {
        return this.isUser(this.currentOffer.sender);
    }

    get isUserReceiver() {
        return !this.isUserSender;
    }

    get userHasDelivered() {
        return this.isUser(this.trade.user1) ? this.trade.user1HasDelivered : this.trade.user2HasDelivered;
    }

    get tradePartnerHasDelivered() {
        return this.isUser(this.trade.user1) ? this.trade.user2HasDelivered : this.trade.user1HasDelivered;
    }

    userArticlesListTitle(onlyOneArticle) {
        let text;

        if (typeof onlyOneArticle === 'undefined') {
            onlyOneArticle = this.currentOffer.userArticles.length === 1;
        }

        if (this.isUserSender) {
            if (this.isNew) {
                text = onlyOneArticle ? 'Du bietest das folgende Artikel an' : 'Du bietest die folgenden Artikel an';
            } else if (this.isCompleted) {
                if (this.userHasDelivered) {
                    text = onlyOneArticle ? `Du hast ${this.tradePartner.name} das folgende Artikel gegeben` : `Du hast ${this.tradePartner.name} die folgenden Artikel gegeben`;
                } else {
                    text = onlyOneArticle ? `Du sollst ${this.tradePartner.name} das folgende Artikel geben` : `Du sollst ${this.tradePartner.name} die folgenden Artikel geben`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `Du hast ${this.tradePartner.name} das folgende Artikel angeboten` : `Du hast ${this.tradePartner.name} die folgenden Artikel angeboten`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? 'Du bietest das folgende Artikel an' : 'Du bietest die folgenden Artikel an';
            } else {
                text = onlyOneArticle ? 'Du bietest das folgende Artikel an' : 'Du bietest die folgenden Artikel an';
            }
        } else {
            if (this.isCompleted) {
                if (this.tradePartnerHasDelivered) {
                    text = onlyOneArticle ? `${this.tradePartner.name} hat das folgende Artikel von Dir erhalten` : `${this.tradePartner.name} hat die folgenden Artikel von Dir erhalten`;
                } else {
                    text = onlyOneArticle ? `Du sollst ${this.tradePartner.name} das folgende Artikel geben` : `Du sollst ${this.tradePartner.name} die folgenden Artikel geben`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `${this.tradePartner.name} hat sich das folgende Artikel von Dir gewünscht` : `${this.tradePartner.name} hat sich die folgenden Artikel von Dir gewünscht`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? `${this.tradePartner.name} möchte das folgende Artikel von Dir` : `${this.tradePartner.name} möchte die folgenden Artikel von Dir`;
            } else {
                text = onlyOneArticle ? `${this.tradePartner.name} möchte das folgende Artikel von Dir` : `${this.tradePartner.name} möchte die folgenden Artikel von Dir`;
            }
        }

        return text;
    }

    partnerArticlesListTitle(onlyOneArticle) {
        let text;

        if (typeof onlyOneArticle === 'undefined') {
            onlyOneArticle = this.currentOffer.tradePartnerArticles.length === 1;
        }

        if (this.isUserSender) {
            if (this.isNew) {
                text = onlyOneArticle ? `Du möchtest das folgende Artikel von ${this.tradePartner.name}` : `Du möchtest die folgenden Artikel von ${this.tradePartner.name}`;
            } else if (this.isCompleted) {
                if (this.tradePartnerHasDelivered) {
                    text = onlyOneArticle ? `Du hast das folgende Artikel von ${this.tradePartner.name} erhalten` : `Du hast die folgenden Artikel von ${this.tradePartner.name} erhalten`;
                } else {
                    text = onlyOneArticle ? `Du erhälst das folgende Artikel von ${this.tradePartner.name}` : `Du erhälst die folgenden Artikel von ${this.tradePartner.name}`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `Du hast Dir das folgende Artikel von ${this.tradePartner.name} gewünscht` : `Du hast Dir die folgenden Artikel von ${this.tradePartner.name} gewünscht`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? `Du möchtest das folgende Artikel von ${this.tradePartner.name}` : `Du möchtest die folgenden Artikel von ${this.tradePartner.name}`;
            } else {
                text = onlyOneArticle ? `Du möchtest das folgende Artikel von ${this.tradePartner.name}` : `Du möchtest die folgenden Artikel von ${this.tradePartner.name}`;
            }
        } else {
            if (this.isCompleted) {
                if (this.tradePartnerHasDelivered) {
                    text = onlyOneArticle ? `${this.tradePartner.name} hat Dir das folgende Artikel gegeben` : `${this.tradePartner.name} hat Dir die folgenden Artikel gegeben`;
                } else {
                    text = onlyOneArticle ? `${this.tradePartner.name} gibt Dir das folgende Artikel` : `${this.tradePartner.name}  gibt Dir die folgenden Artikel`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `${this.tradePartner.name} hat Dir das folgende Artikel angeboten` : `${this.tradePartner.name} hat Dir die folgenden Artikel angeboten`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? `${this.tradePartner.name} bietet Dir das folgende Artikel an` : `${this.tradePartner.name} bietet Dir die folgenden Artikel an`;
            } else {
                text = onlyOneArticle ? `${this.tradePartner.name} bietet Dir das folgende Artikel an` : `${this.tradePartner.name} bietet Dir die folgenden Artikel an`;
            }
        }

        return text;
    }

    get canEdit() {
        return this.isNew || this.isMakingCounteroffer;
    }

    isUser(user) {
        return user._id === this.user._id;
    }
}

module.exports = TradeModel;