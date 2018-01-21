import GlobalMessageParams, { ERROR_MESSAGE, INFO_MESSAGE, WARNING_MESSAGE } from '../../model/GlobalMessageParams';

/*
 * Action Type Constants
 */

export const GLOBAL_MESSAGE_RECEIVED = 'GLOBAL_MESSAGE_RECEIVED';
export const GLOBAL_MESSAGE_REMOVED = 'GLOBAL_MESSAGE_REMOVED';
export const LOADING_STATE_RECEIVED = 'LOADING_STATE_RECEIVED';
export const GLOBAL_PAGE_SIZE_CHANGED = 'GLOBAL_SET_PAGE_SIZE';
export const GLOBAL_POLLING_INTERVAL_CHANGED = 'GLOBAL_POLLING_INTERVAL_CHANGED';

/*
 * Action Creators
 */

export const globalMessageReceived = (messageText, messageType, actionText, actionType) => ({
    type: GLOBAL_MESSAGE_RECEIVED,
    globalMessage: new GlobalMessageParams(messageText, messageType, actionText, actionType)
});

export const globalMessageRemoved = () => ({
    type: GLOBAL_MESSAGE_REMOVED
});

export const loadingStateReceived = (isLoading) => ({
    type: LOADING_STATE_RECEIVED,
    isLoading: isLoading
});

export const pageSizeChanged = (pageSize) => ({
    type: GLOBAL_PAGE_SIZE_CHANGED,
    pageSize: pageSize
});

export const pollingIntervalChanged = (interval) => ({
    type: GLOBAL_POLLING_INTERVAL_CHANGED,
    interval: interval
});

/*
 * Thunk Actions
 */

export const setGlobalMessage = (messageText, messageType, actionText, actionType) => dispatch =>
    dispatchGlobalMessage(dispatch, messageText, messageType, actionText, actionType);

export const removeGlobalMessage = () => dispatch =>
    dispatch(globalMessageRemoved());

export const setPageSize = (pageSize) => dispatch =>
    dispatch(pageSizeChanged(pageSize));

/*
 * Special
 */

export const dispatchGlobalMessage = (dispatch, messageText, messageType, actionText, actionType) =>
    dispatch(globalMessageReceived(messageText, messageType, actionText, actionType));

export const dispatchGlobalErrorMessage = (dispatch, messageText, actionText, actionType) =>
    dispatchGlobalMessage(dispatch, messageText, ERROR_MESSAGE, actionText, actionType);

export const dispatchGlobalWarningMessage = (dispatch, messageText, actionText, actionType) =>
    dispatchGlobalMessage(dispatch, messageText, WARNING_MESSAGE, actionText, actionType);

export const dispatchGlobalInfoMessage = (dispatch, messageText, actionText, actionType) =>
    dispatchGlobalMessage(dispatch, messageText, INFO_MESSAGE, actionText, actionType);
