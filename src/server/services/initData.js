const TradeState = require('../../shared/businessobjects/TradeState');
const OfferState = require('../../shared/businessobjects/OfferState');

function resetData(dataCache) {
    const articles = [
        {ownerId: 0, title: 'Tisch', description: 'Antiker Tisch aus dem Jahr 1900', photos: [], categoryIds: [0]},
        {ownerId: 0, title: 'PC', description: 'Computer mit super Grafikkarte', photos: [], categoryIds: [1]},
        {ownerId: 0, title: 'Fussballschuhe', description: 'Fussballschuhe, fast neu...', photos: [], categoryIds: [2, 3]},
        {ownerId: 1, title: 'Kinderwagen', description: 'Kind ist schon zu gross dafür', photos: [], categoryIds: [4]},
    ];
    const categories = [
        {name: 'Möbel'},
        {name: 'Technik'},
        {name: 'Fussball'},
        {name: 'Sport'},
        {name: 'Kindersachen'}
    ];
    // const offers = [
    //     { tradeId: 0, senderId: 0, receiverId: 1, articleIds: [1, 3] }
    // ];
    const trades = [
        { user1Id: 0, user2Id: 1, state: TradeState.TRADE_STATE_INIT, offers: [{ senderId: 0, state: OfferState.OFFER_STATE_INIT, articleIds: [0, 3] }] }
    ];
    const users = [
        {email: 'calbiez@hsr.ch', name: 'Christian Albiez', newPassword: 'c', registration: new Date()},
        {email: 'stephen.atchison@hsr.ch', name: 'Stephen Atchison', newPassword: 'stephen', registration: new Date()},
        {email: 'max@mustermann.com', name: 'Max Mustermann', newPassword: 'max', registration: new Date()},
        {email: 'jamesbond007@agent.com', name: 'James Bond', newPassword: 'james', registration: new Date()}
    ];

    function insertUsers() {
        console.log('inserting users...');

        for(let i = 0, ii = users.length; i < ii; i++) {
            users[i] = dataCache.prepareUser(users[i]);
        }

        return Promise.all(users.map(
            user => dataCache.saveUser(user)
        ));
    }

    function insertCategories() {
        console.log('inserting categories...');

        for(let i = 0, ii = categories.length; i < ii; i++) {
            categories[i] = dataCache.prepareCategory(categories[i]);
        }

        return Promise.all(categories.map(
            category => dataCache.saveCategory(category)
        ));
    }

    function insertArticles() {
        console.log('inserting articles...');

        for(let i = 0, ii = articles.length; i < ii; i++) {
            let article = articles[i];
            article.owner = users[article.ownerId];
            article.categories = article.categoryIds.map(id => categories[id]);
            articles[i] = dataCache.prepareArticle(article);
        }

        return Promise.all(articles.map(article => {
            return dataCache.saveArticle(article);
        }));
    }

    function insertTrades() {
        console.log('inserting trades...');

        for(let i = 0, ii = trades.length; i < ii; i++) {
            let trade = trades[i];
            trade.user1 = users[trade.user1Id];
            trade.user2 = users[trade.user2Id];
            trade.offers = trade.offers.map(offer => ({ sender: users[offer.senderId], state: offer.state, createDate: new Date(), articles: offer.articleIds.map(id => articles[id]) }));
            trades[i] = dataCache.prepareTrade(trade);
        }

        return Promise.all(trades.map(trade => {
            return dataCache.saveTrade(trade);
        }));
    }

    // function insertOffers() {
    //     console.log('inserting offers...');

    //     for(let i = 0, ii = offers.length; i < ii; i++) {
    //         let offer = offers[i];
    //         offer.trade = trades[offer.tradeId];
    //         offer.sender = users[offer.senderId];
    //         offer.receiver = users[offer.receiverId];
    //         offer.articles = offer.articleIds.map(id => articles[id]);
    //         offers[i] = dataCache.prepareOffer(offer);
    //     }

    //     return Promise.all(offers.map(offer => {
    //         return dataCache.saveOffer(offer);
    //     }));
    // }

    return dataCache.clear()
        .then(() => insertUsers())
        .then(() => insertCategories())
        .then(() => insertArticles())
        .then(() => insertTrades())
//        .then(() => insertOffers())
    ;
}

module.exports = { resetData };
