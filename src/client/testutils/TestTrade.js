import TestArticle from './TestArticle';
import TestOffer from './TestOffer';
import TradeState from '../../shared/constants/TradeState';

export default class TestTrade {
    constructor(user1, user2) {
        this.user1 = user1;
        this.user2 = user2;
        this.state = TradeState.TRADE_STATE_INIT;
        this.offers = [new TestOffer(user1)]
    }

    setState(state) {
        this.state = state;
        return this;
    }

    addOffer(offer) {
        this.offers.unshift(offer);
        return this;
    }
}