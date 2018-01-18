import {
    articleFetched,
    articleCreated,
    articleUpdated,
    articleDeleted,
    selectedArticleRemoved,
    ARTICLE_FETCHED,
    ARTICLE_CREATED,
    ARTICLE_UPDATED,
    ARTICLE_DELETED,
    REMOVE_SELECTED_ARTICLE
} from '../actions/article';
import articleReducer, { initialState } from './article';

import { createDummyAction } from '../../testutils/common';
import { createFootball, createTable } from '../../testutils/articles';

describe('Article Reducer', () => {

    describe(`Test action ${ARTICLE_FETCHED}`, () => {
        test(`Putting fetched article to initial store. Expectation: New state should now contain the fetched article.`, () => {
            const football = createFootball();
            const newState = articleReducer(initialState, articleFetched(football));
            expect(newState).toEqual(football);
        });
        test(`Putting fetched article to store which is not in initial state. Expectation: New state should now contain the fetched article.`, () => {
            const football = createFootball();
            const table = createTable();
            const newState = articleReducer(table, articleFetched(football));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${ARTICLE_CREATED}`, () => {
        test(`Putting created article to initial store. Expectation: New state should now contain the created article.`, () => {
            const football = createFootball();
            const newState = articleReducer(initialState, articleCreated(football));
            expect(newState).toEqual(football);
        });
        test(`Putting created article to store which is not in initial state. Expectation: New state should now contain the created article.`, () => {
            const football = createFootball();
            const table = createTable();
            const newState = articleReducer(table, articleCreated(football));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${ARTICLE_UPDATED}`, () => {
        test(`Putting updated article to initial store. Expectation: New state should now contain the updated article.`, () => {
            const football = createFootball();
            const newState = articleReducer(initialState, articleUpdated(football));
            expect(newState).toEqual(football);
        });
        test(`Putting updated article to store which is not in initial state. Expectation: New state should now contain the updated article.`, () => {
            const football = createFootball();
            const table = createTable();
            const newState = articleReducer(table, articleUpdated(football));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${ARTICLE_DELETED}`, () => {
        test(`Removing deleted article from initial store. Expectation: New state should still be in initial state.`, () => {
            const newState = articleReducer(initialState, articleDeleted('1'));
            expect(newState).toEqual(initialState);
        });
        test(`Removing deleted article from store which contains the deleted article. Expectation: New state should now be in initial state.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, articleDeleted(football._id));
            expect(newState).toEqual(initialState);
        });
        test(`Removing deleted article from store which does not contain the deleted article. Expectation: New state should still contain the previous article.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, articleDeleted('2'));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${REMOVE_SELECTED_ARTICLE}`, () => {
        test(`Removing current article from initial store. Expectation: New state should still be in initial state.`, () => {
            const newState = articleReducer(initialState, selectedArticleRemoved());
            expect(newState).toEqual(initialState);
        });
        test(`Removing current article from store. Expectation: New state should now be in initial state.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, selectedArticleRemoved());
            expect(newState).toEqual(initialState);
        });
    });

    describe('Test any other action', () => {
        test(`Expectation: Any other action should not affect store in initial state.`, () => {
            const newState = articleReducer(initialState, createDummyAction());
            expect(newState).toEqual(initialState);
        });
        test(`Expectation: Any other action should not affect store which is not in initial state.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, createDummyAction());
            expect(newState).toEqual(football);
        });
    });
});
