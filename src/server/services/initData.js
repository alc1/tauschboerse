
function resetData(dataCache) {
    const articles = [
        {userId: 0, title: 'Tisch', description: 'Antiker Tisch aus dem Jahr 1900'},
        {userId: 0, title: 'PC', description: 'Computer mit super Grafikkarte'},
        {userId: 0, title: 'Fussballschuhe', description: 'Fussballschuhe, fast neu...'},
        {userId: 1, title: 'Kinderwagen', description: 'Kind ist schon zu gross dafür'},
    ];
    const categories = [
        {name: 'Möbel'},
        {name: 'Technik'},
        {name: 'Fussball'},
        {name: 'Sport'},
        {name: 'Kindersachen'}
    ];
    const articleCategories = [
        { articleId: 0, categoryId: 0 },
        { articleId: 1, categoryId: 1 },
        { articleId: 2, categoryId: 2 },
        { articleId: 2, categoryId: 3 },
        { articleId: 3, categoryId: 4 },
    ];
    const offerArticles = [
        { offerId: 0, articleId: 0},
    ],
    const offers = [
        { transactionId: 0, senderId: 0, receiverId: 1}
    ];
    const transactions = [
        { user1Id: 0, user2Id: 1}
    ];
    const users = [
        {email: 'christian.albiez@hsr.ch', name: 'Christian Albiez', password: bcrypt.hashSync('christian', 10), registration: new Date()},
        {email: 'stephen.atchison@hsr.ch', name: 'Stephen Atchison', password: bcrypt.hashSync('stephen', 10), registration: new Date()},
        {email: 'max@mustermann.com', name: 'Max Mustermann', password: bcrypt.hashSync('max', 10), registration: new Date()},
        {email: 'jamesbond007@agent.com', name: 'James Bond', password: bcrypt.hashSync('james', 10), registration: new Date()}
    ];

    function insertUsers() {
        return Promise.all(users.map(user => dataCache.addUser(user)));
    }

    function insertCategories() {
        return Promise.all(categories.map(category => dataCache.addCategory(category)));
    }

    function insertArticles() {
        return Promise.all(articles.map(article => {
            article.userId = users[article.userId]._id;
            return dataCache.addArticle(article);
        }));
    }

    function insertArticleCategories() {
        return Promise.all(articleCategories.map(rec => {

        }));
    }

    function insertTransactions() {
        return Promise.all(transactions.map(transaction => {
            transaction.user1Id = users[transaction.user1Id]._id;
            transaction.user2Id = users[transaction.user2Id]._id;
            return dataCache.addTransaction(transaction);
        }));
    }

    function insertOffers() {
        
    }

    function insertOfferArticles() {

    }

    return dataCache.ckear()
        .then(() => insertUsers())
        .then(() => insertCategories())
        .then(() => insertArticles())
        .then(() => insertArticleCategories())
        .then(() => insertTransactions())
        .then(() => insertOffers())
        .then(() => insertOfferArticles());
}
