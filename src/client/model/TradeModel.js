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

    get versionstamp() {
        return this.trade.versionstamp;
    }

    get createDate() {
        return this.trade.createDate;
    }

    get exists() {
        return (typeof this.trade._id !== 'undefined');
    }

    get requiresAttention() {
        return (this.isUserSender && this.isOpen && (this.isDeclined || this.isInvalidated))
            || (this.isUserReceiver && this.isOpen && !(this.isDeclined || this.isInvalidated))
            || (this.isCompleted && !this.userHasDelivered);
    }

    get openButDoesNotRequireAttention() {
        return (this.isUserSender && this.isOpen && !(this.isDeclined || this.isInvalidated))
            || (this.isUserReceiver && this.isOpen && (this.isDeclined || this.isInvalidated));
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

    get userIsMakingCounteroffer() {
        return this.hasCounteroffer && ((this.isUserReceiver && !(this.isDeclined || this.isInvalidated)) || (this.isUserSender && (this.isDeclined || this.isInvalidated)));
    }

    get userMadeCurrentOffer() {
        return this.isOpen && this.isUserSender;
    }

    get userReceivedCurrentOffer() {
        return this.isOpen && this.isUserReceiver;
    }

    get counteroffer() {
        return this.hasCounteroffer ? this.offers[0] : null;
    }

    get canEditOffer() {
        return (this.isNew && this.isUserSender) || (this.userReceivedCurrentOffer && this.userIsMakingCounteroffer);
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
        return !((this.isNew && this.currentOffer.isValid) || (this.userIsMakingCounteroffer && this.counteroffer.isValid));
    }

    get watchForUpdates() {
        return this.isOpen || (this.isCompleted && !this.tradePartnerHasDelivered);
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

    get canEdit() {
        return this.isNew || this.userIsMakingCounteroffer;
    }

    isOutOfDate(versionstamp) {
        return this.trade.versionstamp !== versionstamp;
    }

    userArticlesListTitle(onlyOneArticle) {
        let text;

        if (typeof onlyOneArticle === 'undefined') {
            onlyOneArticle = this.currentOffer.userArticles.length === 1;
        }

        if (this.isUserSender) {
            if (this.isNew) {
                text = onlyOneArticle ? 'Du bietest folgenden Artikel an:' : 'Du bietest folgende Artikel an:';
            } else if (this.isCompleted) {
                if (this.userHasDelivered) {
                    text = onlyOneArticle ? `Du hast ${this.tradePartner.name} folgenden Artikel gegeben:` : `Du hast ${this.tradePartner.name} folgende Artikel gegeben:`;
                } else {
                    text = onlyOneArticle ? `Du gibst ${this.tradePartner.name} folgenden Artikel:` : `Du gibst ${this.tradePartner.name} folgende Artikel:`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `Du hattest ${this.tradePartner.name} folgenden Artikel angeboten:` : `Du hattest ${this.tradePartner.name} folgende Artikel angeboten:`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? 'Du bietest folgenden Artikel an:' : 'Du bietest folgende Artikel an:';
            } else {
                text = onlyOneArticle ? 'Du bietest folgenden Artikel an:' : 'Du bietest folgende Artikel an:';
            }
        } else {
            if (this.isCompleted) {
                if (this.tradePartnerHasDelivered) {
                    text = onlyOneArticle ? `${this.tradePartner.name} hat folgenden Artikel von Dir erhalten:` : `${this.tradePartner.name} hat folgende Artikel von Dir erhalten:`;
                } else {
                    text = onlyOneArticle ? `Du gibst ${this.tradePartner.name} folgenden Artikel:` : `Du gibst ${this.tradePartner.name} folgende Artikel:`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `${this.tradePartner.name} wollte folgenden Artikel von Dir:` : `${this.tradePartner.name} wollte folgende Artikel von Dir:`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? `${this.tradePartner.name} möchte folgenden Artikel von Dir:` : `${this.tradePartner.name} möchte folgende Artikel von Dir:`;
            } else {
                text = onlyOneArticle ? `${this.tradePartner.name} möchte folgenden Artikel von Dir:` : `${this.tradePartner.name} möchte folgende Artikel von Dir:`;
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
                text = onlyOneArticle ? `Du möchtest folgenden Artikel von ${this.tradePartner.name}:` : `Du möchtest folgende Artikel von ${this.tradePartner.name}:`;
            } else if (this.isCompleted) {
                if (this.tradePartnerHasDelivered) {
                    text = onlyOneArticle ? `Du hast folgenden Artikel von ${this.tradePartner.name} erhalten:` : `Du hast folgende Artikel von ${this.tradePartner.name} erhalten:`;
                } else {
                    text = onlyOneArticle ? `Du erhälst folgenden Artikel von ${this.tradePartner.name}:` : `Du erhälst folgende Artikel von ${this.tradePartner.name}:`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `Du wolltest folgenden Artikel von ${this.tradePartner.name}:` : `Du wolltest folgende Artikel von ${this.tradePartner.name}:`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? `Du möchtest folgenden Artikel von ${this.tradePartner.name}:` : `Du möchtest folgende Artikel von ${this.tradePartner.name}:`;
            } else {
                text = onlyOneArticle ? `Du möchtest folgenden Artikel von ${this.tradePartner.name}:` : `Du möchtest folgende Artikel von ${this.tradePartner.name}:`;
            }
        } else {
            if (this.isCompleted) {
                if (this.tradePartnerHasDelivered) {
                    text = onlyOneArticle ? `${this.tradePartner.name} hat Dir folgenden Artikel gegeben:` : `${this.tradePartner.name} hat Dir folgende Artikel gegeben:`;
                } else {
                    text = onlyOneArticle ? `${this.tradePartner.name} gibt Dir folgenden Artikel:` : `${this.tradePartner.name} gibt Dir folgende Artikel:`;
                }
            } else if (this.isCanceled) {
                text = onlyOneArticle ? `${this.tradePartner.name} hatte Dir folgenden Artikel angeboten:` : `${this.tradePartner.name} hatte Dir folgende Artikel angeboten:`;
            } else if (this.isOpen) {
                text = onlyOneArticle ? `${this.tradePartner.name} bietet Dir folgenden Artikel an:` : `${this.tradePartner.name} bietet Dir folgende Artikel an:`;
            } else {
                text = onlyOneArticle ? `${this.tradePartner.name} bietet Dir folgenden Artikel an:` : `${this.tradePartner.name} bietet Dir folgende Artikel an:`;
            }
        }

        return text;
    }

    isUser(user) {
        return user._id === this.user._id;
    }
}

module.exports = TradeModel;