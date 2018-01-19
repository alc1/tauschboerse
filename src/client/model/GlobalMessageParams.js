/*
 * Global message types
 */

export const INFO_MESSAGE = 'INFO_MESSAGE';
export const WARNING_MESSAGE = 'WARNING_MESSAGE';
export const ERROR_MESSAGE = 'ERROR_MESSAGE';

/*
 * Follow-up Action Type Constants from within the global message snackbar
 */

export const GO_TO_LOGIN = 'GO_TO_LOGIN';
export const RELOAD_TRADE = 'RELOAD_TRADE';


export default class GlobalMessageParams {
    constructor(messageText, messageType, actionText, actionType) {
        this.messageText = messageText;
        this.messageType = messageType;
        this.actionText = actionText;
        this.actionType = actionType;
    }

    get hasAction() {
        return (typeof this.acitonText !== 'undefined');
    }
}
