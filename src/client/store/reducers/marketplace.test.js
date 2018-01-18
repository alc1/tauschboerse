import {
    ARTICLES_FOUND,
    LAST_SEARCH_CLEARED,
    MARKETPLACE_SECTION_OPENED,
    articlesFound,
    lastSearchCleared,
    marketplaceSectionOpened
} from '../actions/marketplace';

import marketplaceReducer, { initialState } from './marketplace';
import { createDummyAction } from '../../testutils/common';
import { createFootball, createTable } from '../../testutils/articles';
import SearchInfo from '../../model/SearchInfo';

describe('Marketplace Reducer', () => {

    describe(`Action ${ARTICLES_FOUND}`, () => {
        test('', () => {
            const searchText = 'abcd'
            const articles = [createTable()];
            const userArticles = [createFootball()];
            const newState = marketplaceReducer(initialState, articlesFound(searchText, articles, userArticles));
            expect(newState).not.toBe(initialState);
            expect(newState.searchInfo).toEqual({ hasSearched: true, text: searchText, articles: articles, userArticles: userArticles });
        });
    });

    describe(`Action ${LAST_SEARCH_CLEARED}`, () => {
        test('', () => {
            const searchText = 'abcd'
            const articles = [createTable()];
            const userArticles = [createFootball()];
            const searchedState = marketplaceReducer(initialState, articlesFound(searchText, articles, userArticles));
            const clearedState = marketplaceReducer(searchedState, lastSearchCleared());
            expect(clearedState).not.toBe(searchedState);
            expect(clearedState.searchInfo).toEqual(new SearchInfo());
        });
    });

    describe(`Action ${MARKETPLACE_SECTION_OPENED}`, () => {
        test('', () => {
            const sectionIndex = 3;
            const newState = marketplaceReducer(initialState, marketplaceSectionOpened(sectionIndex));
            expect(newState).not.toBe(initialState);
            expect(newState.marketplaceSectionIndex).toBe(sectionIndex);
        });
    });

    describe('Any other action', () => {
        test('should return the store in its current state', () => {
            const copiedInitialState = { ...initialState };
            const newState = marketplaceReducer(initialState, createDummyAction());
            expect(newState).toBe(initialState);
            expect(newState).toEqual(copiedInitialState);
        });
    });
});