import filterArticles from './filterArticles';
import { createBasketball, createFootball, createTable } from '../client/testutils/articles';

describe('', () => {
    test('finds articles with the search text in their titles', () => {
        const football = createFootball().addCategory(1, 'Sport');
        const basketball = createBasketball().addCategory(1, 'Sport');
        const table = createTable().addCategory(2, 'Möbel');

        const articles = [football, basketball, table];
        const filteredArticles = filterArticles('ball', articles);
        expect(articles).toEqual([basketball, football]);
    });
    test('finds articles with the search text in their descriptions', () => {
        const football = createFootball().addCategory(1, 'Sport');
        const basketball = createBasketball().addCategory(1, 'Sport');
        const table = createTable().addCategory(2, 'Möbel');

        const articles = [football, basketball, table];
        const filteredArticles = filterArticles('spielen', articles);
        expect(articles).toEqual([basketball, football]);
    });
    test('finds articles with the search text in their categories', () => {
        const football = createFootball().addCategory(1, 'Sport');
        const basketball = createBasketball().addCategory(1, 'Sport');
        const table = createTable().addCategory(2, 'Möbel');

        const articles = [football, basketball, table];
        const filteredArticles = filterArticles('sport', articles);
        expect(articles).toEqual([basketball, football]);
    });
});
