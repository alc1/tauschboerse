import {
    globalMessageReceived,
    globalMessageRemoved,
    loadingStateReceived,
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED,
    LOADING_STATE_RECEIVED
} from '../actions/application';
import {
    ERROR_MESSAGE,
    WARNING_MESSAGE,
    INFO_MESSAGE,
    GO_TO_LOGIN,
    RELOAD_TRADE
} from '../../model/GlobalMessageParams';

import applicationReducer, { initialState } from './application';

import { createDummyAction } from '../../testutils/common';

const createErrorGlobalMessage = () => {
    return {
        messageText: 'Ein Fehler ist aufgetreten',
        messageType: ERROR_MESSAGE,
        actionText: 'Login',
        actionType: GO_TO_LOGIN
    };
};
const createWarningGlobalMessage = () => {
    return {
        messageText: 'Eine Warnung ist aufgetreten',
        messageType: WARNING_MESSAGE,
    };
};
const createOkGlobalMessage = () => {
    return {
        messageText: 'Alles ist OK',
        messageType: INFO_MESSAGE,
    };
};

describe('Application Reducer', () => {

    describe(`Test action ${GLOBAL_MESSAGE_RECEIVED}`, () => {
        test(`Putting OK global message to store with initial state. Expectation: New state should now contain the OK global message.`, () => {
            const messageText = 'Ein Fehler ist aufgetreten';
            const messageType = ERROR_MESSAGE;
            const actionText = 'Login';
            const actionType = GO_TO_LOGIN;
            const message = { messageText, messageType, actionText, actionType };
            const initialStateCopy = { ...initialState };
            const newState = applicationReducer(initialState, globalMessageReceived(messageText, messageType, actionText, actionType));
            expect(newState).not.toBe(initialState);
            expect(newState).toEqual({ ...initialState, globalMessage: message });
            expect(initialState).toEqual(initialStateCopy);
        });
    });

    describe(`Test action ${GLOBAL_MESSAGE_REMOVED}`, () => {
        test(`Removing global message from store with initial state. Expectation: New state should still be the initial state.`, () => {
            const initialStateCopy = { ...initialState };
            const newState = applicationReducer(initialState, globalMessageRemoved());
            expect(newState).toBe(initialState);
            expect(initialState).toEqual(initialStateCopy);
        });
        test(`Removing global message from store with any state. Expectation: New state should now be in initial state.`, () => {
            const message = { messageText: 'Ein Fehler ist aufgetreten', messageType: ERROR_MESSAGE, actionText: 'Login', actionType: GO_TO_LOGIN };
            const startingState = { ...initialState, globalMessage: message };
            const startingStateCopy = { ...startingState };
            const endState = applicationReducer(startingState, globalMessageRemoved());
            expect(endState).not.toBe(startingState);
            expect(endState).toEqual(initialState);
            expect(startingState).toEqual(startingStateCopy);
        });
    });

    describe(`Test action ${LOADING_STATE_RECEIVED}`, () => {
        test(`Change loadingCounter from 0 to 1 should change isLoading from false to true`, () => {
            const startingState = { ...initialState, isLoading: false, loadingCounter: 0 };
            const startingStateCopy = { ...startingState };
            const endState = applicationReducer(startingState, loadingStateReceived(true));
            expect(endState).not.toBe(startingState);
            expect(endState).toEqual({ ...initialState, isLoading: true, loadingCounter: 1 });
            expect(startingState).toEqual(startingStateCopy);
        });
        test(`Change loading counter from 1 to 0 should change isLoading from true to false`, () => {
            const startingState = { ...initialState, isLoading: true, loadingCounter: 1 };
            const startingStateCopy = { ...startingState };
            const endState = applicationReducer(startingState, loadingStateReceived(false));
            expect(endState).not.toBe(startingState);
            expect(endState).toEqual({ ...initialState, isLoading: false, loadingCounter: 0 });
            expect(startingState).toEqual(startingStateCopy);
        });
        test(`Increase loading counter from any number greater than 0 to the next higher doesn't change the isLoading flag`, () => {
            const startingState = { ...initialState, isLoading: true, loadingCounter: 6 };
            const startingStateCopy = { ...startingState };
            const endState = applicationReducer(startingState, loadingStateReceived(true));
            expect(endState).not.toBe(startingState);
            expect(endState).toEqual({ ...initialState, isLoading: true, loadingCounter: 7 });
            expect(startingState).toEqual(startingStateCopy);
        });
        test(`Decrease loading counter from any number greater than 1 to the next lower doesn't change the isLoading flag`, () => {
            const startingState = { ...initialState, isLoading: true, loadingCounter: 3 };
            const startingStateCopy = { ...startingState };
            const endState = applicationReducer(startingState, loadingStateReceived(false));
            expect(endState).not.toBe(startingState);
            expect(endState).toEqual({ ...initialState, isLoading: true, loadingCounter: 2 });
            expect(startingState).toEqual(startingStateCopy);
        });
        test('Decrease loading counter when it is already 0 should not change the state and leave a message in the console', () => {
            const startingState = { ...initialState, isLoading: false, loadingCounter: 0 };
            const startingStateCopy = { ...startingState };
            const endState = applicationReducer(startingState, loadingStateReceived(false));
            expect(endState).toBe(startingState);
            expect(endState).toEqual(startingStateCopy);
        });
    });

    describe('Test any other action', () => {
        test(`Expectation: Any other action should not affect store with initial state.`, () => {
            const newState = applicationReducer(initialState, createDummyAction());
            expect(newState).toEqual(initialState);
        });
        test(`Expectation: Any other action should not affect store which has any state.`, () => {
            const okMessage = createOkGlobalMessage();
            const newState = applicationReducer({ ...initialState, globalMessage: okMessage, loadingCounter: 1 }, createDummyAction());
            expect(newState).toEqual({ ...initialState, globalMessage: okMessage, loadingCounter: 1 });
        });
    });
});
