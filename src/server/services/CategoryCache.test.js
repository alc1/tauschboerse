const Datastore = require('nedb');
const CategoryCache = require('./CategoryCache');
const Category = require('../../shared/businessobjects/Category');

function initializeCategoryCache(initCache, generateTestData) {
    let db = new Datastore();
    let generateDataPromise = new Promise((resolve, rejcet) => {
        if (generateTestData) {
            let insertRec = function(name) {
                return new Promise(function(resolve, reject) {
                    let rec = CategoryCache.toPhysicalRecord(new Category({ name: name }));
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
    let categoryCache = new CategoryCache(db);
    let initCachePromise = new Promise((resolve, reject) => {
        if (initCache) {
            categoryCache.init().then(() => resolve(true)).catch((err) => reject(err));
        } else {
            resolve(true);
        }
    });

    return generateDataPromise.then(() => initCachePromise());
}

describe('CategoryCache: prepare method', () => {
    let id = 'ABCDEFGHIJ123456';
    let name = 'Belletristik';

    let categoryCache = initializeCategoryCache(false, false);

    test('Prepare empty business object', () => {
        let input = undefined;
        let category = categoryCache.prepare(input);
        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBeNull();
        expect(category._id).not.toBeDefined();
    });

    test('Prepare new business object', () => {
        let input = { name: name };
        let category = categoryCache.prepare(input);
        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe(name);
        expect(category._id).not.toBeDefined();
    });

    test('Prepare existing business object', () => {
        let input = { name: name, _id: id };
        let category = categoryCache.prepare(input);
        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe(name);
        expect(category._id).toBe(id);
    });

    test('Prepare business object with unexpected properties', () => {
        let input = { name: name, _id: id, notWanted: 'irrelevant' };
        let category = categoryCache.prepare(input);
        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.notWanted).not.toBeDefined();
    });
});

describe('CategoryCache: toPhysicalRecord method', () => {
    let id = 'ABCDEFGHIJ123456';
    let name = 'Belletristik';
    
    test('Build physical record for new category', () => {
        let category = new Category({ name: name });
        let rec = CategoryCache.toPhysicalRecord(category);

        expect(rec).toBeDefined();
        expect(rec.name).toBe(name);
        expect(rec._id).not.toBeDefined();
    });
    
    test('Build physical record for existing category', () => {
        let category = new Category({ name: name, _id: id });
        let rec = CategoryCache.toPhysicalRecord(category);

        expect(rec).toBeDefined();
        expect(rec.name).toBe(name);
        expect(rec._id).toBe(id);
    });
});

describe('CategoryCache: toLogicalRecord method', () => {
    let id = 'ABCDEFGHIJ123456';
    let name = 'Belletristik';
    
    test('Build logical record for category', () => {
        let rec = { name: name, _id: id };
        let category = CategoryCache.toLogicalRecord(rec);

        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe(name);
        expect(category._id).toBe(id);
    });
});

describe('CategoryCache: init', () => {
    let categoryCache = initializeCategoryCache(false, true);

    test('Cache initialization', () => {
        categoryCache.init();
    });
});

describe('CategoryCache: CRUD', () => {
    let categoryCache = initializeCategoryCache(true, false);

    // get record count

    // add record

    // get record count

    // change name of category

    // get record count and get record

    // delete record

    // get record count
});
