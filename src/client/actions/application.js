import { removeToken } from './user';

/*
 * Action Type Constants
 */

export const GLOBAL_MESSAGE_RECEIVED = 'GLOBAL_MESSAGE_RECEIVED';
export const GLOBAL_MESSAGE_REMOVED = 'GLOBAL_MESSAGE_REMOVED';

export const SET_LOADING = 'SET_LOADING';

/*
 * Global Message Types
 */

export const OK_MESSAGE = 'OK_MESSAGE';
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

const globalMessageRemoved = () => ({
    type: GLOBAL_MESSAGE_REMOVED
});

const loadingStateReceived = (isLoading) => ({
    type: SET_LOADING,
    isLoading: isLoading
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

/*
 * Follow-up Actions from within the global message snackbar
 */

export const goToLogin = (history) => dispatch => {
    removeToken(dispatch);
    history.push('/login');
};
