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
} from './../actions/article';
import articleReducer from './article';
import Article from '../../shared/businessobjects/Article';

const createDummyAction = () => {
    return {
        type: 'ANY_ACTION',
        payload: 'dummy payload'
    };
};
const createFootball = () => {
    return new Article({
        _id: '1',
        title: 'Fussball',
        description: 'Ein Ball zum Fussballspielen'
    });
};
const createTable = () => {
    return new Article({
        _id: '2',
        title: 'Tisch',
        description: 'Ein exklusiver Designer-Tisch'
    });
};

describe('Article Reducer', () => {

    describe(`Test action ${ARTICLE_FETCHED}`, () => {
        test(`Putting fetched article to empty store. Expectation: New state should contain the fetched article now.`, () => {
            const football = createFootball();
            const newState = articleReducer(null, articleFetched(football));
            expect(newState).toEqual(football);
        });
        test(`Putting fetched article to store which is not empty. Expectation: New state should contain the fetched article now.`, () => {
            const football = createFootball();
            const table = createTable();
            const newState = articleReducer(table, articleFetched(football));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${ARTICLE_CREATED}`, () => {
        test(`Putting created article to empty store. Expectation: New state should contain the created article now.`, () => {
            const football = createFootball();
            const newState = articleReducer(null, articleCreated(football));
            expect(newState).toEqual(football);
        });
        test(`Putting created article to store which is not empty. Expectation: New state should contain the created article now.`, () => {
            const football = createFootball();
            const table = createTable();
            const newState = articleReducer(table, articleCreated(football));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${ARTICLE_UPDATED}`, () => {
        test(`Putting updated article to empty store. Expectation: New state should contain the updated article now.`, () => {
            const football = createFootball();
            const newState = articleReducer(null, articleUpdated(football));
            expect(newState).toEqual(football);
        });
        test(`Putting updated article to store which is not empty. Expectation: New state should contain the updated article now.`, () => {
            const football = createFootball();
            const table = createTable();
            const newState = articleReducer(table, articleUpdated(football));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${ARTICLE_DELETED}`, () => {
        test(`Removing deleted article from empty store. Expectation: New state should still be empty.`, () => {
            const newState = articleReducer(null, articleDeleted('1'));
            expect(newState).toEqual(null);
        });
        test(`Removing deleted article from store which contains the deleted article. Expectation: New state should be empty now.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, articleDeleted('1'));
            expect(newState).toEqual(null);
        });
        test(`Removing deleted article from store which does not contain the deleted article. Expectation: New state should still contain the previous article.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, articleDeleted('2'));
            expect(newState).toEqual(football);
        });
    });

    describe(`Test action ${REMOVE_SELECTED_ARTICLE}`, () => {
        test(`Removing current article from empty store. Expectation: New state should still be empty.`, () => {
            const newState = articleReducer(null, selectedArticleRemoved());
            expect(newState).toEqual(null);
        });
        test(`Removing current article from store. Expectation: New state should be empty now.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, selectedArticleRemoved());
            expect(newState).toEqual(null);
        });
    });

    describe('Test any other action', () => {
        test(`Expectation: Any other action should not affect empty store.`, () => {
            const newState = articleReducer(null, createDummyAction());
            expect(newState).toEqual(null);
        });
        test(`Expectation: Any other action should not affect store which is not empty.`, () => {
            const football = createFootball();
            const newState = articleReducer(football, createDummyAction());
            expect(newState).toEqual(football);
        });
    });
});
