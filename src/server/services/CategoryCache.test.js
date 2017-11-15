const Datastore = require('nedb');
const CategoryCache = require('./CategoryCache').CategoryCache;
const Category = require('../../shared/businessobjects/Category');

var categoryCache = null;

function initializeCategoryCache() {
    let db = new Datastore();
    categoryCache = new CategoryCache(db);
}

beforeEach(() => {
    return initializeCategoryCache();
  });

describe('CategoryCache utility methods', () => {
    test('Prepare business object', () => {
        let input = undefined;
        let category = categoryCache.prepare(input);
        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBeNull();
    });
});