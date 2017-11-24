import {
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED,
    SET_LOADING
} from '../actions/application';

const initialState = {
    globalMessage: {},
    isLoading: false
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
                globalMessage: {}
            };
        case SET_LOADING:
            return {
                ...theState,
                isLoading: theAction.isLoading
            };
        default:
            return theState;
    }
}
