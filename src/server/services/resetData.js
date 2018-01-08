const fs = require("fs");
const path = require('path');
const uuid = require("uuid");

const TradeState = require('../../shared/constants/TradeState');
const OfferState = require('../../shared/constants/OfferState');
const Gender = require('../../shared/constants/Gender');

function resetData(dataCache) {
    // const articles = [
    //     {ownerId: 0, title: 'Tisch', description: 'Antiker Tisch aus dem Jahr 1900', photos: [], categoryIds: [0]},
    //     {ownerId: 0, title: 'PC', description: 'Computer mit super Grafikkarte', photos: [], categoryIds: [1]},
    //     {ownerId: 0, title: 'Fussballschuhe', description: 'Fussballschuhe, fast neu...', photos: [], categoryIds: [2, 3]},
    //     {ownerId: 1, title: 'Kinderwagen', description: 'Kind ist schon zu gross dafür', photos: [], categoryIds: [4]},
    // ];
    // const categories = [
    //     {name: 'Möbel'},
    //     {name: 'Technik'},
    //     {name: 'Fussball'},
    //     {name: 'Sport'},
    //     {name: 'Kindersachen'}
    // ];
    // const trades = [
    //     { user1Id: 1, user2Id: 0, state: TradeState.TRADE_STATE_INIT, offers: [{ senderId: 1, state: OfferState.OFFER_STATE_INIT, articleIds: [0, 3] }], user1HasDelivered: false, user2HasDelivered: false }
    // ];
    // const users = [
    //     {gender: Gender.MALE, email: 'calbiez@hsr.ch', name: 'Christian Albiez', address: '', newPassword: 'c', registration: new Date()},
    //     {gender: Gender.MALE, email: 'stephen.atchison@hsr.ch', name: 'Stephen Atchison', address: '', newPassword: 'stephen', registration: new Date()},
    //     {gender: Gender.MALE, email: 'max@mustermann.com', name: 'Max Mustermann', address: '', newPassword: 'max', registration: new Date()},
    //     {gender: Gender.MALE, email: 'jamesbond007@agent.com', name: 'James Bond', address: '', newPassword: 'james', registration: new Date()}
    // ];

    var articles, categories, trades, users;
    var photoFilenameMap = [];

    function loadJSONData(filename) {
        var contents = fs.readFileSync(`./test/data/${filename}`);
        return JSON.parse(contents);
    }

    function loadData() {
        articles = loadJSONData('articles.json');
        categories = loadJSONData('categories.json');
        trades = loadJSONData('trades.json');
        users = loadJSONData('users.json');

        // initialize registration date
        users.forEach(user => {
            user.registration = new Date()
        });
    }

    function copyFile(source, target, cb) {
        var cbCalled = false;
      
        var rd = fs.createReadStream(source);
        rd.on("error", function(err) {
            done(err);
        });

        var wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
            done(err);
        });

        wr.on("close", function(ex) {
            done();
        });

        rd.pipe(wr);
      
        function done(err) {
            if (!cbCalled) {
                cb(err);
                cbCalled = true;
            }
        }
    }

    function removeDirForce(path) {
        let files = fs.readdirSync(path);
        if (files.length > 0) {
            files.forEach(file => {
                let filePath = path + file + "/";
                let stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    fs.unlinkSync(filePath);
                } else if (stats.isDirectory()) {
                    removeDirForce(filePath);
                }
            });
        }
        fs.rmdirSync(path);
    }

    function updatePhotoFilenameMap(article, newArticle) {
        photoFilenameMap.forEach(entry => {
            if (entry.article === article) {
                entry.article = newArticle;
            }
        });
    }

    function buildPhotoFilename(name, article) {
        let newFilename = uuid.v1() + name.substr(name.lastIndexOf('.'));
        photoFilenameMap.push({ article: article, originalName: name, filename: newFilename });

        return newFilename;
    }
    
    function createDirectory(dir) {
        const dirPath = path.join(dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    }

    function createArticleImagesRootDirectory() {
        createDirectory('./public/images');
        createDirectory('./public/images/article');
    }

    function copyPhotos() {
        // first delete all current photos
        removeDirForce('./public/images/article/');

        // recreate images folder
        createArticleImagesRootDirectory()

        // now copy the files to the correct folders
        if (photoFilenameMap.length > 0) {
            console.log('Copying article photos...');
            photoFilenameMap.forEach(rec => {
                console.log(`copying ${rec.originalName} to .../${rec.article._id}/${rec.filename}...`);
                createDirectory(`./public/images/article/${rec.article._id}`);
                copyFile(`./test/data/images/${rec.originalName}`, `./public/images/article/${rec.article._id}/${rec.filename}`, err => console.log(err));
            });
        }
    }

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
            article.photos = article.photos.map((name, idx) => ({ fileName: buildPhotoFilename(name, article), isMain: idx === 0 }));
            articles[i] = dataCache.prepareArticle(article);
            updatePhotoFilenameMap(article, articles[i]);
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

    // read the sample data from disk
    loadData();

    // load the data into the cache and the underlying data files
    return dataCache.clear()
        .then(() => insertUsers())
        .then(() => insertCategories())
        .then(() => insertArticles())
        .then(() => insertTrades())
        .then(() => copyPhotos());
}

module.exports = resetData;
