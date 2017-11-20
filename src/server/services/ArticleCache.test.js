const Datastore = require('nedb');
const ArticleCache = require('./ArticleCache').ArticleCache;
const Article = require('../../shared/businessobjects/Article');

function initializeCache(initCache, generateTestData) {
    let db = new Datastore();
    let generateDataPromise = new Promise((resolve, rejcet) => {
        if (generateTestData) {
            let insertRec = function(name) {
                return new Promise(function(resolve, reject) {
                    let rec = ArticleCache.toPhysicalRecord(new Article({ name: name }));
                    db.insert(rec, (newRec, err) => {
                        if (err) {
                            reject(err);                        
                        } else {
                            resolve(newRec);
                        }
                    });
                });
            };
            Promise.all([insertRec('Sport'), insertRec('Kleidung'), insertRec('Schuhe')]).then(() => resolve(true)).catch((err) => reject(err));
        } else {
            resolve(true);
        }
    });
    let articleCache = new ArticleCache(db);
    let initCachePromise = new Promise((resolve, reject) => {
        if (initCache) {
            articleCache.init().then(() => resolve(true)).catch((err) => reject(err));
        } else {
            resolve(true);
        }
    });

    return generateDataPromise.then(() => initCachePromise());
}

describe('ArticleCache: prepare method', () => {
    let id = 'ABCDEFGHIJ123456';
    let name = 'Belletristik';

    let articleCache = initializeCache(false, false);

    test('Prepare empty business object', () => {
        let input = undefined;
        let article = articleCache.prepare(input);
        expect(article).toBeDefined();
        expect(article).toBeInstanceOf(Article);
        expect(article.name).toBeNull();
        expect(article._id).not.toBeDefined();
    });

    test('Prepare new business object', () => {
        let input = { name: name };
        let article = articleCache.prepare(input);
        expect(article).toBeDefined();
        expect(article).toBeInstanceOf(Article);
        expect(article.name).toBe(name);
        expect(article._id).not.toBeDefined();
    });

    test('Prepare existing business object', () => {
        let input = { name: name, _id: id };
        let article = articleCache.prepare(input);
        expect(article).toBeDefined();
        expect(article).toBeInstanceOf(Article);
        expect(article.name).toBe(name);
        expect(article._id).toBe(id);
    });

    test('Prepare business object with unexpected properties', () => {
        let input = { name: name, _id: id, notWanted: 'irrelevant' };
        let article = articleCache.prepare(input);
        expect(article).toBeDefined();
        expect(article).toBeInstanceOf(Article);
        expect(article.notWanted).not.toBeDefined();
    });
});

describe('ArticleCache: toPhysicalRecord method', () => {
    let id = 'ABCDEFGHIJ123456';
    let name = 'Belletristik';
    
    test('Build physical record for new article', () => {
        let article = new Article({ name: name });
        let rec = ArticleCache.toPhysicalRecord(article);

        expect(rec).toBeDefined();
        expect(rec.name).toBe(name);
        expect(rec._id).not.toBeDefined();
    });
    
    test('Build physical record for existing article', () => {
        let article = new Article({ name: name, _id: id });
        let rec = ArticleCache.toPhysicalRecord(article);

        expect(rec).toBeDefined();
        expect(rec.name).toBe(name);
        expect(rec._id).toBe(id);
    });
});

describe('ArticleCache: toLogicalRecord method', () => {
    let id = 'ABCDEFGHIJ123456';
    let name = 'Belletristik';
    
    test('Build logical record for article', () => {
        let rec = { name: name, _id: id };
        let article = ArticleCache.toLogicalRecord(rec);

        expect(article).toBeDefined();
        expect(article).toBeInstanceOf(Article);
        expect(article.name).toBe(name);
        expect(article._id).toBe(id);
    });
});

describe('ArticleCache: init', () => {
    let articleCache = initializeCache(false, true);

    test('Cache initialization', () => {
        articleCache.init();
    });
});

describe('ArticleCache: CRUD', () => {
    let articleCache = initializeCache(true, false);

    // get record count

    // add record

    // get record count

    // change name of article

    // get record count and get record

    // delete record

    // get record count
});
