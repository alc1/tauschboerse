import SearchInfo from './SearchInfo';

import { createFootball, createTable } from '../testutils/articles'

describe('SearchInfo', () => {

    describe('setSearchResults works correctly', () => {
        const searchText = 'abcd';
        const articles = [createFootball()];
        const userArticles = [createTable()]
        const searchInfo = new SearchInfo().setSearchResults(searchText, articles, userArticles);
        expect(searchInfo).toEqual({ hasSearched: true, text: searchText, articles: articles, userArticles: userArticles });
    });

    describe('A SearchInfo instance', () => {
        test('newly created can be cloned correctly', () => {
            const initialSearchInfo = new SearchInfo();
            const clonedSearchInfo = new SearchInfo(initialSearchInfo);
            expect(clonedSearchInfo).toEqual(initialSearchInfo);
            expect(clonedSearchInfo).not.toBe(initialSearchInfo);
        });
        test('with articles and search-test can be cloned correctly', () => {
            const searchText = 'abcd';
            const articles = [createFootball()];
            const userArticles = [createTable()]
            const initialSearchInfo = new SearchInfo().setSearchResults(searchText, articles, userArticles);
            const clonedSearchInfo = new SearchInfo(initialSearchInfo);
            expect(clonedSearchInfo).toEqual(initialSearchInfo);
            expect(clonedSearchInfo).not.toBe(initialSearchInfo);
        });
    });

    describe('clear', () =>{
        test('resets a SearchInfo instance', () => {
            const searchText = 'abcd';
            const articles = [createFootball()];
            const userArticles = [createTable()]
            const searchInfo = new SearchInfo().setSearchResults(searchText, articles, userArticles);
            searchInfo.clear();
            expect(searchInfo).toEqual(new SearchInfo());
        });
    });
});