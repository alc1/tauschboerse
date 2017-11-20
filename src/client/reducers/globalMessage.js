import {
    GLOBAL_MESSAGE_RECEIVED,
    GLOBAL_MESSAGE_REMOVED
} from './../actions/globalMessage';

const initialState = {};

export default function globalMessage(theState = initialState, theAction) {
    switch (theAction.type) {
        case GLOBAL_MESSAGE_RECEIVED:
            return {
                messageText: theAction.globalMessage.messageText,
                messageType: theAction.globalMessage.messageType,
                actionText: theAction.globalMessage.actionText,
                actionType: theAction.globalMessage.actionType
            };
        case GLOBAL_MESSAGE_REMOVED:
            return {};
        default:
            return theState;
    }
}
