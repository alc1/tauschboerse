import {
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED,
    LOADING_STATE_RECEIVED
} from '../actions/application';

const initialGlobalMessage = {};
const initialLoadingState = false;

export const initialState = {
    globalMessage: initialGlobalMessage,
    isLoading: initialLoadingState
};

export default function globalMessage(theState = initialState, theAction) {
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
                isLoading: theAction.isLoading
            };
        default:
            return theState;
    }
}
