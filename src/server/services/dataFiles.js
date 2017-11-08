const Datastore = require('nedb');

class DataFiles {
    constructor() {}
    
    init(inMemory) {
        this.dbArticles = new Datastore(inMemory ? undefined : { filename : './data/articles.db', autoload : true });
        this.dbCategories = new Datastore(inMemory ? undefined : { filename : './data/categories.db', autoload : true });
        this.dbOffers = new Datastore(inMemory ? undefined : { filename : './data/offers.db', autoload : true });
        this.dbTransactions = new Datastore(inMemory ? undefined : { filename : './data/transactions.db', autoload : true });
        this.dbUsers = new Datastore(inMemory ? undefined : { filename : './data/users.db', autoload : true });
    }
}

const datafiles = new DataFiles();

module.exports = {
    datafiles
};
