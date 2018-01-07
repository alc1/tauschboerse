import {
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED,
    LOADING_STATE_RECEIVED
} from '../actions/application';

const initialGlobalMessage = {};
const initialLoadingCounter = 0;

export const initialState = {
    globalMessage: initialGlobalMessage,
    loadingCounter: initialLoadingCounter
};

export default function application(theState = initialState, theAction) {
    switch (theAction.type) {
        case GLOBAL_MESSAGE_RECEIVED:
            return {
                ...theState,
                globalMessage: {
                    messageText: theAction.globalMessage.messageText,
                    messageType: theAction.globalMessage.messageType,
                    actionText: theAction.globalMessage.actionText,
                    actionType: theAction.globalMessage.actionType
                }
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
        default:
            return theState;
    }
}
