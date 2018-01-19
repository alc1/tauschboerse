import { globalMessageReceived, ERROR_MESSAGE, GO_TO_LOGIN } from './application';

export const handleError = (error, dispatch) => {
    if (error.response) {
        if (error.response.status === 401) {
            dispatch(globalMessageReceived({
                messageText: getErrorMessage(error),
                messageType: ERROR_MESSAGE,
                actionText: 'Login',
                actionType: GO_TO_LOGIN
            }));
        }
        else if (error.response.status === 404 || error.response.status === 413) {
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
    }
    else if (error.message) {
        console.error(error);
        dispatch(globalMessageReceived({
            messageText: "Unerwarteter Fehler",
            messageType: ERROR_MESSAGE
        }));
    }
    throw error;
};

const getErrorMessage = (error) => {
    return (error.response.data.globalError) ? error.response.data.globalError : error.response.statusText;
};
