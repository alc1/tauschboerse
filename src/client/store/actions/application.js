import { removeToken } from './user';

/*
 * Action Type Constants
 */

export const GLOBAL_MESSAGE_RECEIVED = 'GLOBAL_MESSAGE_RECEIVED';
export const GLOBAL_MESSAGE_REMOVED = 'GLOBAL_MESSAGE_REMOVED';
export const LOADING_STATE_RECEIVED = 'LOADING_STATE_RECEIVED';
export const PAGE_SIZE_CHANGED = 'APP_SET_PAGE_SIZE';

/*
 * Global Message Types
 */

export const OK_MESSAGE = 'OK_MESSAGE';
export const WARNING_MESSAGE = 'WARNING_MESSAGE';
export const ERROR_MESSAGE = 'ERROR_MESSAGE';

/*
 * Follow-up Action Type Constants from within the global message snackbar
 */

export const GO_TO_LOGIN = 'GO_TO_LOGIN';

/*
 * Action Creators
 */

export const globalMessageReceived = (theGlobalMessage) => ({
    type: GLOBAL_MESSAGE_RECEIVED,
    globalMessage: theGlobalMessage
});

export const globalMessageRemoved = () => ({
    type: GLOBAL_MESSAGE_REMOVED
});

export const loadingStateReceived = (isLoading) => ({
    type: LOADING_STATE_RECEIVED,
    isLoading: isLoading
});

export const pageSizeChanged = (pageSize) => ({
    type: PAGE_SIZE_CHANGED,
    pageSize: pageSize
});

/*
 * Thunk Actions
 */

export const setGlobalMessage = (theGlobalMessage) => dispatch =>
    dispatch(globalMessageReceived(theGlobalMessage));

export const removeGlobalMessage = () => dispatch =>
    dispatch(globalMessageRemoved());

export const setLoading = (isLoading) => dispatch =>
    dispatch(loadingStateReceived(isLoading));

export const setPageSize = (pageSize) => dispatch =>
    dispatch(pageSizeReceived(pageSize));
/*
 * Follow-up Actions from within the global message snackbar
 */

export const goToLogin = (history, location) => dispatch => {
    removeToken(dispatch, false);
    const to = {
        pathname: '/login',
        state: { from: location.pathname + location.search }
    };
    history.push(to);
};
