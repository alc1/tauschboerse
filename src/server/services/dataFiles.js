const Datastore = require('nedb');

const dbArticles = new Datastore({ filename : './data/articles.db', autoload : true });
const dbArticleCategories = new Datastore({ filename : './data/articleCategories.db', autoload : true });
const dbCategories = new Datastore({ filename : './data/categories.db', autoload : true });
const dbOffers = new Datastore({ filename : './data/offers.db', autoload : true });
const dbOfferArticles = new Datastore({ filename : './data/offerArticles.db', autoload : true });
const dbTransactions = new Datastore({ filename : './data/transactions.db', autoload : true });
const dbTransactionOffers = new Datastore({ filename : './data/transactionOffers.db', autoload : true });
const dbUsers = new Datastore({ filename : './data/users.db', autoload : true });

module.export = {
    dbArticles,
    dbArticleCategories,
    dbCategories,
    dbOffers,
    dbOfferArticles,
    dbTransactions,
    dbTransactionOffers,
    dbUsers
};
