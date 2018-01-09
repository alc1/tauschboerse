const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const TradeState = require('../../shared/constants/TradeState');
const OfferState = require('../../shared/constants/OfferState');
const Gender = require('../../shared/constants/Gender');

function resetData(dataCache) {
    var articles, categories, trades, users;
    var photoFilenameMap = [];

    function loadJSONData(filename) {
        var contents = fs.readFileSync(`./test/testdata/${filename}`);
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
      
        // open reader
        var rd = fs.createReadStream(source);
        rd.on("error", function(err) {
            done(err);
        });

        // open writer
        var wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
            done(err);
        });

        // copy the file
        rd.pipe(wr);
      
        function done(err) {
            if (!cbCalled) {

                // close the streams manually (only required if an error occurs)
                rd.destroy();
                wr.destroy();

                // notify caller
                cb(err);
                cbCalled = true;
            }
        }
    }

    function emptyDirForce(path) {
        let files = fs.readdirSync(path);
        if (files.length > 0) {
            files.forEach(file => {
                let filePath = path + file + "/";
                let stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    fs.unlinkSync(filePath);
                } else if (stats.isDirectory()) {
                    emptyDirForce(filePath);
                    fs.rmdirSync(filePath);
                }
            });
        }
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
        createDirectory('./public');
        createDirectory('./public/images');
        createDirectory('./public/images/article');
    }

    function copyPhotos() {
        // first delete all current photos if necessary
        let imgPath = './public/images/article/';
        if (fs.existsSync(imgPath)) {
            emptyDirForce(imgPath);
        }

        // recreate images folder
        createArticleImagesRootDirectory(imgPath)

        // now copy the files to the correct folders
        if (photoFilenameMap.length > 0) {
            console.log('Copying article photos...');
            photoFilenameMap.forEach(rec => {
                console.log(`copying ${rec.originalName} to .../${rec.article._id}/${rec.filename}...`);
                createDirectory(`${imgPath}${rec.article._id}`);
                copyFile(`./test/testdata/images/${rec.originalName}`, `${imgPath}${rec.article._id}/${rec.filename}`, err => console.log(err));
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
