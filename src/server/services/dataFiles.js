const Datastore = require('nedb');

const dbArticles = new Datastore({ filename : './data/articles.db', autoload : true });
const dbCategories = new Datastore({ filename : './data/categories.db', autoload : true });
const dbOffers = new Datastore({ filename : './data/offers.db', autoload : true });
const dbTrades = new Datastore({ filename : './data/trades.db', autoload : true });
const dbUsers = new Datastore({ filename : './data/users.db', autoload : true });

module.exports = {
    dbArticles,
    dbCategories,
    dbOffers,
    dbTrades,
    dbUsers
};
