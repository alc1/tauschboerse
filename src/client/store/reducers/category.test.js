import {
    categoriesFetched,
    CATEGORIES_FETCHED
} from '../actions/category';
import articleReducer, { initialState } from './category';

import { createDummyAction } from '../../testutils/common';

const createCategoriesGroup1 = () => {
    return [
        { _id: '1', name: 'Football' },
        { _id: '2', name: 'Sport' },
        { _id: '3', name: 'Furnitures' }
    ];
};
const createCategoriesGroup2 = () => {
    return [
        { _id: '1', name: 'Football' },
        { _id: '4', name: 'Clothes' },
        { _id: '5', name: 'Shoes' }
    ];
};

describe('Category Reducer', () => {

    describe(`Test action ${CATEGORIES_FETCHED}`, () => {
        test(`Putting fetched categories to initial store. Expectation: New state should now contain the fetched categories.`, () => {
            const categoriesGroup1 = createCategoriesGroup1();
            const newState = articleReducer(initialState, categoriesFetched(categoriesGroup1));
            expect(newState).toEqual(categoriesGroup1);
            expect(newState).not.toBe(initialState);
        });
        test(`Putting fetched categories to store which is not in initial state. Expectation: New state should now contain the fetched categories.`, () => {
            const categoriesGroup1 = createCategoriesGroup1();
            const categoriesGroup2 = createCategoriesGroup2();
            const newState = articleReducer(categoriesGroup1, categoriesFetched(categoriesGroup2));
            expect(newState).toEqual(categoriesGroup2);
            expect(newState).not.toBe(initialState);
        });
    });

    describe('Test any other action', () => {
        test(`Expectation: Any other action should not affect store in initial state.`, () => {
            const newState = articleReducer(initialState, createDummyAction());
            expect(newState).toEqual(initialState);
            expect(newState).toBe(initialState);
        });
        test(`Expectation: Any other action should not affect store which is not in initial state.`, () => {
            const categoriesGroup1 = createCategoriesGroup1();
            const newState = articleReducer(categoriesGroup1, createDummyAction());
            expect(newState).toEqual(categoriesGroup1);
            expect(newState).not.toBe(initialState);
        });
    });
});
