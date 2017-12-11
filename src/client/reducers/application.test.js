import {
    globalMessageReceived,
    globalMessageRemoved,
    loadingStateReceived,
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED,
    LOADING_STATE_RECEIVED,
    ERROR_MESSAGE,
    WARNING_MESSAGE,
    OK_MESSAGE,
    GO_TO_LOGIN
} from './../actions/application';
import applicationReducer, { initialState } from './application';

const createDummyAction = () => {
    return {
        type: 'ANY_ACTION',
        payload: 'dummy payload'
    };
};
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
        messageType: OK_MESSAGE,
    };
};

describe('Application Reducer', () => {

    describe(`Test action ${GLOBAL_MESSAGE_RECEIVED}`, () => {
        test(`Putting OK global message to store with initial state. Expectation: New state should now contain the OK global message.`, () => {
            const okMessage = createOkGlobalMessage();
            const newState = applicationReducer(initialState, globalMessageReceived(okMessage));
            expect(newState).toEqual({ ...initialState, globalMessage: okMessage });
        });
        test(`Putting OK global message to store with any state. Expectation: New state should now contain the OK global message.`, () => {
            const okMessage = createOkGlobalMessage();
            const warningMessage = createWarningGlobalMessage();
            const newState = applicationReducer({ ...initialState, globalMessage: warningMessage }, globalMessageReceived(okMessage));
            expect(newState).toEqual({ ...initialState, globalMessage: okMessage });
        });

        test(`Putting WARNING global message to store with initial state. Expectation: New state should now contain the WARNING global message.`, () => {
            const warningMessage = createWarningGlobalMessage();
            const newState = applicationReducer(initialState, globalMessageReceived(warningMessage));
            expect(newState).toEqual({ ...initialState, globalMessage: warningMessage });
        });
        test(`Putting WARNING global message to store with any state. Expectation: New state should now contain the WARNING global message.`, () => {
            const warningMessage = createWarningGlobalMessage();
            const errorMessage = createErrorGlobalMessage();
            const newState = applicationReducer({ ...initialState, globalMessage: errorMessage }, globalMessageReceived(warningMessage));
            expect(newState).toEqual({ ...initialState, globalMessage: warningMessage });
        });

        test(`Putting ERROR global message to store with initial state. Expectation: New state should now contain the ERROR global message.`, () => {
            const errorMessage = createErrorGlobalMessage();
            const newState = applicationReducer(initialState, globalMessageReceived(errorMessage));
            expect(newState).toEqual({ ...initialState, globalMessage: errorMessage });
        });
        test(`Putting ERROR global message to store with any state. Expectation: New state should now contain the ERROR global message.`, () => {
            const errorMessage = createWarningGlobalMessage();
            const okMessage = createOkGlobalMessage();
            const newState = applicationReducer({ ...initialState, globalMessage: okMessage }, globalMessageReceived(errorMessage));
            expect(newState).toEqual({ ...initialState, globalMessage: errorMessage });
        });
    });

    describe(`Test action ${GLOBAL_MESSAGE_REMOVED}`, () => {
        test(`Removing global message from store with initial state. Expectation: New state should still be the initial state.`, () => {
            const newState = applicationReducer(initialState, globalMessageRemoved());
            expect(newState).toEqual(initialState);
        });
        test(`Removing global message from store with any state. Expectation: New state should now be in initial state.`, () => {
            const okMessage = createOkGlobalMessage();
            const newState = applicationReducer({ ...initialState, globalMessage: okMessage }, globalMessageRemoved());
            expect(newState).toEqual(initialState);
        });
    });

    describe(`Test action ${LOADING_STATE_RECEIVED}`, () => {
        test(`Set loading state to TRUE with initial state before. Expectation: New state should now contain the new loading state.`, () => {
            const newState = applicationReducer(initialState, loadingStateReceived(true));
            expect(newState).toEqual({ ...initialState, isLoading: true });
        });
        test(`Set loading state to FALSE with loading state on TRUE before. Expectation: The loading state should now be FALSE in the new state.`, () => {
            const newState = applicationReducer({ ...initialState, isLoading: true }, loadingStateReceived(false));
            expect(newState).toEqual({ ...initialState, isLoading: false });
        });
        test(`Set loading state to TRUE with state which also contains any global message. Expectation: New state should now contain the new loading state and the global message from before.`, () => {
            const okMessage = createOkGlobalMessage();
            const newState = applicationReducer({ ...initialState, globalMessage: okMessage }, loadingStateReceived(false));
            expect(newState).toEqual({ ...initialState, globalMessage: okMessage, isLoading: false });
        });
    });

    describe('Test any other action', () => {
        test(`Expectation: Any other action should not affect store with initial state.`, () => {
            const newState = applicationReducer(initialState, createDummyAction());
            expect(newState).toEqual(initialState);
        });
        test(`Expectation: Any other action should not affect store which has any state.`, () => {
            const okMessage = createOkGlobalMessage();
            const newState = applicationReducer({ ...initialState, globalMessage: okMessage, isLoading: true }, createDummyAction());
            expect(newState).toEqual({ ...initialState, globalMessage: okMessage, isLoading: true });
        });
    });
});
