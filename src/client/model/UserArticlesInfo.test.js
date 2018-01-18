import {
    STATUS_FREE,
    STATUS_DEALING,
    STATUS_DEALED,
    STATUS_DELETED,
} from '../../shared/constants/ArticleStatus';
import { createBasketball, createFootball, createTable, createUserArticlesFilter } from '../testutils/articles';
import UserArticlesInfo from './UserArticlesInfo';

describe('UserArticlesInfo', () => {

    describe('An UserArticlesInfo instance', () => {
        test(`newly created can be cloned correctly`, () => {
            const initialUserArticlesInfo = new UserArticlesInfo();
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo)
            expect(newUserArticlesInfo).toEqual(initialUserArticlesInfo);
            expect(newUserArticlesInfo).not.toBe(initialUserArticlesInfo);
        });
        test(`with filter and articles can be cloned correctly`, () => {
            const articles = [ createFootball(), createTable() ];
            const filter = createUserArticlesFilter();
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(articles).setFilter(filter.filterText, filter.filterStatus);
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo)
            expect(newUserArticlesInfo).toEqual(initialUserArticlesInfo);
            expect(newUserArticlesInfo).not.toBe(initialUserArticlesInfo);
        });
    });

    describe('isFilteredByStatus in an instance', () => {
        test('that is empty is false', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(userArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('with filterStatus set to undefined is false', () => {
            const userArticlesInfo = new UserArticlesInfo().setFilter('');
            expect(userArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('with filterStatus set to null is false', () => {
            const userArticlesInfo = new UserArticlesInfo().setFilter('', null);
            expect(userArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('with filterStatus set to FREE is true', () => {
            const userArticlesInfo = new UserArticlesInfo().setFilter('', 'FREE');
            expect(userArticlesInfo.isFilteredByStatus).toBe(true);
        });
    });

    describe('setFilter[filterStatus]', () => {
        test('called with undefined stops filtering by status', () => {
            const initialUserArticlesInfo = new UserArticlesInfo().setFilter('', STATUS_FREE);
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setFilter('');
            expect(initialUserArticlesInfo.isFilteredByStatus).toBe(true);
            expect(newUserArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('called with null stops filtering by status', () => {
            const initialUserArticlesInfo = new UserArticlesInfo().setFilter('', STATUS_FREE);
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setFilter('', null);
            expect(initialUserArticlesInfo.isFilteredByStatus).toBe(true);
            expect(newUserArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('called with an empty string stops filtering by status', () => {
            const initialUserArticlesInfo = new UserArticlesInfo().setFilter('', STATUS_FREE);
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setFilter('', '');
            expect(initialUserArticlesInfo.isFilteredByStatus).toBe(true);
            expect(newUserArticlesInfo.isFilteredByStatus).toBe(false);
        });
        test('called with an unknown status throws an exception', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setFilter('', 'FREEBOOTY'); }).toThrow();
        });
        test('called with a number throws an exception', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setFilter('', 10); }).toThrow();
        });
        test('called with a boolean throws an exception', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setFilter('', true); }).toThrow();
        });
        test('called with an object throws an exception', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setFilter('', {}); }).toThrow();
        });
        test('called with a valid status starts filtering', () => {
            const initialUserArticlesInfo = new UserArticlesInfo();
            const statusToFilterBy = 'FREE';
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setFilter('', statusToFilterBy);
            expect(initialUserArticlesInfo.isFilteredByStatus).toBe(false);
            expect(newUserArticlesInfo.isFilteredByStatus).toBe(true);
            expect(newUserArticlesInfo.filterInfo.filterStatus).toBe(statusToFilterBy);
        });
    });

    describe('setFilter[filterText]', () => {
        test('called with a number throws an exception', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setFilter(10, ''); }).toThrow();
        });
        test('called with a boolean throws an exception', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setFilter(true, ''); }).toThrow();
        });
        test('called with an object throws an exception', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setFilter({}, ''); }).toThrow();
        });
        test('called with a string starts filtering', () => {
            const initialUserArticlesInfo = new UserArticlesInfo();
            const stringToFilterBy = 'ball';
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setFilter(stringToFilterBy, '');
            expect(newUserArticlesInfo.filterInfo.filterText).toBe(stringToFilterBy);
        });
    });

    describe('setArticles', () => {
        test('sets articles to the array passed to it', () => {
            const initialUserArticlesInfo = new UserArticlesInfo();
            const articles = [createFootball(), createTable()];
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setArticles(articles);
            expect(newUserArticlesInfo.articles).toBe(articles);
        });
        test('interprets undefined as an empty array', () => {
            const articles = [createFootball(), createTable()];
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(articles);
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setArticles();
            expect(newUserArticlesInfo.articles).toEqual([]);
        });
        test('interprets null as an empty array', () => {
            const articles = [createFootball(), createTable()];
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(articles);
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).setArticles(null);
            expect(newUserArticlesInfo.articles).toEqual([]);
        });
        test('throws an exception is not passed an array', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => { userArticlesInfo.setArticles({}); }).toThrow();
        });
        test('sorts the given articles by title', () => {
            const articles = [createTable(), createFootball()];
            const userArticlesInfo = new UserArticlesInfo().setArticles(articles);
            const sortedArticles = [createFootball(), createTable()];
            expect(articles).toEqual(sortedArticles);
            expect(userArticlesInfo.articles).toEqual(articles);
        });
    });

    describe('updateArticle', () => {
        test('throws an exception if not given an object', () => {
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => userArticlesInfo.updateArticle()).toThrow();
            expect(() => userArticlesInfo.updateArticle(null)).toThrow();
            expect(() => userArticlesInfo.updateArticle(true)).toThrow();
            expect(() => userArticlesInfo.updateArticle(10)).toThrow();
            expect(() => userArticlesInfo.updateArticle('article')).toThrow();
        });
        test('throws an exception if given an object without an id', () => {
            const article = createFootball();
            delete article._id;
            const userArticlesInfo = new UserArticlesInfo();
            expect(() => userArticlesInfo.updateArticle(article)).toThrow();
        });
        test('to update the article in its array of articles', () => {
            const articles = [createFootball(), createTable()];
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(articles);
            const newArticle = createTable();
            newArticle.description = 'NEW ' + newArticle.description;
            const newArticles = [createFootball(), newArticle];
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).updateArticle(newArticle);
            expect(newUserArticlesInfo.articles).toEqual(newArticles);
        });
        test('to update the article in its array of articles and then resort the array', () => {
            const articles = [createFootball(), createTable()];
            const initialUserArticlesInfo = new UserArticlesInfo().setArticles(articles);
            const newArticle = createFootball();
            newArticle.title = 'ZZZ_' + newArticle.title;
            const newArticles = [createTable(), newArticle];
            const newUserArticlesInfo = new UserArticlesInfo(initialUserArticlesInfo).updateArticle(newArticle);
            expect(newUserArticlesInfo.articles).toEqual(newArticles);
        });
    });

    describe('deleteArticle', () => {
        test('throws an error when not given a value', () => {
            const articles = [createFootball(), createTable()];
            const userArticlesInfo = new UserArticlesInfo().setArticles(articles);
            expect(() => { userArticlesInfo.deleteArticle(); }).toThrow();
            expect(() => { userArticlesInfo.deleteArticle(null); }).toThrow();
            expect(() => { userArticlesInfo.deleteArticle(''); }).toThrow();
        });
        test('to remove the given article from the list of articles', () => {
            const articles = [createFootball(), createTable()];
            const userArticlesInfo = new UserArticlesInfo().setArticles(articles);
            const articleToRemove = createFootball();
            userArticlesInfo.deleteArticle(articleToRemove._id);
            expect(userArticlesInfo.articles).toEqual([createTable()]);
        });
    });

    describe('filtering', () => {
        test('just by text works', () => {
            const football = createFootball().setStatus(STATUS_DEALED);
            const table = createTable(STATUS_DELETED);
            const articles = [football, table];
            const userArticlesInfo = new UserArticlesInfo().setArticles(articles).setFilter('ball', '');
            expect(userArticlesInfo.filteredArticles).toEqual([football]);
        });
        test('just by status works', () => {
            const football = createFootball().setStatus(STATUS_DEALED);
            const table = createTable().setStatus(STATUS_DELETED);
            const articles = [football, table];
            const userArticlesInfo = new UserArticlesInfo().setArticles(articles).setFilter('', STATUS_DELETED);
            expect(userArticlesInfo.filteredArticles).toEqual([table]);
        });
        test('by text and status works', () => {
            const basketball = createBasketball().setStatus(STATUS_DEALING);
            const football = createFootball().setStatus(STATUS_DEALED);
            const table = createTable().setStatus(STATUS_DEALING);
            const articles = [basketball, football, table];
            const userArticlesInfo = new UserArticlesInfo().setArticles(articles).setFilter('ball', STATUS_DEALING);
            expect(userArticlesInfo.filteredArticles).toEqual([basketball]);
        });
    });
});