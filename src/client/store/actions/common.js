import { dispatchGlobalErrorMessage } from './application';
import { GO_TO_LOGIN } from '../../model/GlobalMessageParams';

export const handleError = (error, dispatch) => {
    if (error.response) {
        if (error.response.status === 401) {
            dispatchGlobalErrorMessage(dispatch, getErrorMessage(error), 'Login', GO_TO_LOGIN);
        }
        else if (error.response.status === 404 || error.response.status === 413) {
            dispatchGlobalErrorMessage(dispatch, getErrorMessage(error));
        }
        else if (error.response.status === 500) {
            dispatchGlobalErrorMessage(dispatch, getErrorMessage(error));
        }
    }
    else if (error.message) {
        console.error(error);
        dispatchGlobalErrorMessage(dispatch, "Unerwarteter Fehler");
    }
    throw error;
};

const getErrorMessage = (error) => {
    return (error.response.data.globalError) ? error.response.data.globalError : error.response.statusText;
};
