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
    pollingInterval: initialPollingInterval
};

// refernce counter for isLoading flag. It is kept outside the store so that the store
// only changes when the isLoading state changes
export const loadingCounter = {
    value: 0
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
            let isLoadingChanged = false;
            if (theAction.isLoading) {
                loadingCounter.value++;
                isLoadingChanged = loadingCounter.value === 1;
            } else {
                if (loadingCounter.value > 0) {
                    loadingCounter.value--;
                    isLoadingChanged = loadingCounter.value === 0;
                } else {
                    console.error('loadingCounter mismatch detected! Are your setLoadingState calls balanced?');
                }
            }

            // only change the store if the isLoading flag has changed
            let newState;
            if (isLoadingChanged) {
                newState = {
                    ...theState,
                    isLoading: loadingCounter.value > 0
                };
            } else {
                newState = theState;
            }
            return newState;
        case GLOBAL_POLLING_INTERVAL_CHANGED:
            return {
                ...theState,
                pollingInterval: theAction.interval
            };
        default:
            return theState;
    }
}
