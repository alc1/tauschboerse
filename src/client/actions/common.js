import { globalMessageReceived, ERROR_MESSAGE, GO_TO_LOGIN } from './globalMessage';

export const handleError = (error, dispatch) => {
    if (error.response.status === 401 || error.response.status === 403) {
        dispatch(globalMessageReceived({
            messageText: getErrorMessage(error),
            messageType: ERROR_MESSAGE,
            actionText: 'Zum Login',
            actionType: GO_TO_LOGIN
        }));
    }
    else if (error.response.status === 404) {
        dispatch(globalMessageReceived({
            messageText: getErrorMessage(error),
            messageType: ERROR_MESSAGE
        }));
    }
    else if (error.response.status === 500) {
        dispatch(globalMessageReceived({
            messageText: getErrorMessage(error),
            messageType: ERROR_MESSAGE
        }));
    }
    throw error;
};

const getErrorMessage = (error) => {
    return (error.response.data.globalError) ? error.response.data.globalError : error.response.statusText;
};