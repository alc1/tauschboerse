import {
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED,
    LOADING_STATE_RECEIVED,
    GLOBAL_POLLING_INTERVAL_CHANGED
} from '../actions/application';

const initialGlobalMessage = null;
const initialIsLoading = false;
const initialPollingInterval = 1000;

export const initialState = {
    globalMessage: initialGlobalMessage,
    isLoading: initialIsLoading,
    loadingCounter: 0,
    pollingInterval: initialPollingInterval
};

export default function application(theState = initialState, theAction) {
    switch (theAction.type) {
        case GLOBAL_MESSAGE_RECEIVED:
            return {
                ...theState,
                globalMessage: theAction.globalMessage
            };
        case GLOBAL_MESSAGE_REMOVED:
            if (theState.globalMessage) {
                return {
                    ...theState,
                    globalMessage: initialGlobalMessage
                };
            } else {
                return theState;
            }
        case LOADING_STATE_RECEIVED:
            if ((theState.loadingCounter === 0) && !theAction.isLoading) {
                console.error('loadingCounter mismatch detected! Are your setLoadingState calls balanced?');
                return theState;
            }

            let { loadingCounter } = theState;
            loadingCounter = theAction.isLoading ? loadingCounter + 1 : loadingCounter - 1;

            // only change the store if the isLoading flag has changed
            return {
                ...theState,
                isLoading: loadingCounter > 0,
                loadingCounter: loadingCounter
            };
        case GLOBAL_POLLING_INTERVAL_CHANGED:
            return {
                ...theState,
                pollingInterval: theAction.interval
            };
        default:
            return theState;
    }
}
