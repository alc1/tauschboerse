import {
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED,
    LOADING_STATE_RECEIVED,
    GLOBAL_POLLING_INTERVAL_CHANGED
} from '../actions/application';

import GlobalMessageParams from '../../model/GlobalMessageParams';

const initialGlobalMessage = new GlobalMessageParams();
const initialLoadingCounter = 0;
const initialPollingInterval = 1000;

export const initialState = {
    globalMessage: initialGlobalMessage,
    loadingCounter: initialLoadingCounter,
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
            return {
                ...theState,
                globalMessage: initialGlobalMessage
            };
        case LOADING_STATE_RECEIVED:
            return {
                ...theState,
                loadingCounter: theAction.isLoading ? theState.loadingCounter + 1 : (theState.loadingCounter <= 0 ? 0 : theState.loadingCounter - 1)
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
