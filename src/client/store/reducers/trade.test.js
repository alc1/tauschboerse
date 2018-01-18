import tradeReducer, { initialState } from './trade';
import {
    TRADE_FETCHED,
    TRADE_FETCHING,
    TRADE_NOT_FOUND,
    TRADE_DELETED,
    TRADE_ARTICLES_SAVED,
    TRADE_ARTICLES_FETCHED,
    TRADE_ARTICLE_TOGGLED,
    TRADE_STEP_INDEX_SET,
    TRADE_PAGE_NUM_SET,
    TRADE_ARTICLE_FILTER_TEXT_SET,
    TRADE_EDITOR_INITIALISED,
    TRADE_NEW_VERSION_AVAILABLE,
    tradeFetched,
    tradeIsBeingFetched,
    tradeNotFound,
    newTradeVersionAvailable,
    tradeDeleted,
    articlesFetched,
    articleToggled,
    stepIndexSet,
    pageNumSet,
    tradeEditorInitialised,
    articleFilterTextSet
} from '../actions/trade';

import { createDummyAction } from '../../testutils/common';

describe('Trade reducer', () => {

    describe(`Action ${TRADE_FETCHED}`, () => {

    });

    describe(`Action ${TRADE_FETCHING}`, () => {

    });

    describe(`Action ${TRADE_NOT_FOUND}`, () => {

    });

    describe(`Action ${TRADE_DELETED}`, () => {

    });

    describe(`Action ${TRADE_ARTICLES_SAVED}`, () => {

    });

    describe(`Action ${TRADE_ARTICLES_FETCHED}`, () => {

    });

    describe(`Action ${TRADE_ARTICLE_TOGGLED}`, () => {

    });

    describe(`Action ${TRADE_STEP_INDEX_SET}`, () => {

    });

    describe(`Action ${TRADE_PAGE_NUM_SET}`, () => {

    });

    describe(`Action ${TRADE_ARTICLE_FILTER_TEXT_SET}`, () => {

    });

    describe(`Action ${TRADE_EDITOR_INITIALISED}`, () => {

    });

    describe(`Action ${TRADE_NEW_VERSION_AVAILABLE}`, () => {

    });

    describe('Any other action', () => {
        test('should return the store in its current state', () => {
            const copiedInitialState = { ...initialState };
            const newState = tradeReducer(initialState, createDummyAction());
            expect(newState).toBe(initialState);
            expect(newState).toEqual(copiedInitialState);
        });
    });
});