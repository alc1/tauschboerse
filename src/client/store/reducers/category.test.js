import {
    categoriesFetched,
    CATEGORIES_FETCHED
} from '../actions/category';
import articleReducer, { initialState } from './category';
import Category from '../../../shared/businessobjects/Category';

const createDummyAction = () => {
    return {
        type: 'ANY_ACTION',
        payload: 'dummy payload'
    };
};
const createCategoriesGroup1 = () => {
    return [
        new Category({ _id: '1', name: 'Football' }),
        new Category({ _id: '2', name: 'Sport' }),
        new Category({ _id: '3', name: 'Furnitures' })
    ];
};
const createCategoriesGroup2 = () => {
    return [
        new Category({ _id: '1', name: 'Football' }),
        new Category({ _id: '4', name: 'Clothes' }),
        new Category({ _id: '5', name: 'Shoes' })
    ];
};

describe('Category Reducer', () => {

    describe(`Test action ${CATEGORIES_FETCHED}`, () => {
        test(`Putting fetched categories to initial store. Expectation: New state should now contain the fetched categories.`, () => {
            const categoriesGroup1 = createCategoriesGroup1();
            const newState = articleReducer(initialState, categoriesFetched(categoriesGroup1));
            expect(newState).toEqual(categoriesGroup1);
        });
        test(`Putting fetched categories to store which is not in initial state. Expectation: New state should now contain the fetched categories.`, () => {
            const categoriesGroup1 = createCategoriesGroup1();
            const categoriesGroup2 = createCategoriesGroup2();
            const newState = articleReducer(categoriesGroup1, categoriesFetched(categoriesGroup2));
            expect(newState).toEqual(categoriesGroup2);
        });
    });

    describe('Test any other action', () => {
        test(`Expectation: Any other action should not affect store in initial state.`, () => {
            const newState = articleReducer(initialState, createDummyAction());
            expect(newState).toEqual(initialState);
        });
        test(`Expectation: Any other action should not affect store which is not in initial state.`, () => {
            const categoriesGroup1 = createCategoriesGroup1();
            const newState = articleReducer(categoriesGroup1, createDummyAction());
            expect(newState).toEqual(categoriesGroup1);
        });
    });
});
