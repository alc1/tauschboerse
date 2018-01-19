import { dispatchGlobalErrorMessage } from './application';
import { GO_TO_LOGIN } from '../../model/GlobalMessageParams';
import ErrorCode from '../../../shared/constants/ErrorCode';

export const handleError = (error, dispatch) => {
    if (error.response) {
        if (error.response.status === 401) {
            dispatchGlobalErrorMessage(dispatch, getErrorMessage(error), 'Login', GO_TO_LOGIN);
        }
        else if (error.response.status === 403) {
            dispatchGlobalErrorMessage(dispatch, getErrorMessage(error));
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
    if (error.response.data) {
        if (error.response.data.globalError) {
            return error.response.data.globalError;
        }
        else if (error.response.data === ErrorCode.TRADE_ARTICLES_WRONG_REQUEST_USER) {
            return 'Sie dürfen dieses Tauschgeschäft nicht bearbeiten.';
        }
        else if (error.response.data === ErrorCode.TRADE_ARTICLES_WRONG_STATE) {
            return 'In diesem Zustand darf das Tauschgeschäft nicht bearbeitet werden.';
        }
        else if (error.response.data === ErrorCode.TRADE_ARTICLES_BELONG_TO_WRONG_USER) {
            return 'Alle Artikel müssen einem der beiden Tauschparteien gehören.';
        }
        else if (error.response.data === ErrorCode.TRADE_DELETE_NOT_POSSIBLE) {
            return 'In diesem Zustand darf das Tauschgeschäft nicht gelöscht werden.';
        }
        else if (error.response.data === ErrorCode.TRADE_ACCEPT_DECLINE_NOT_POSSIBLE) {
            return 'Das Tauschgeschäft kann in diesem Zustand nicht angenommen oder abgelehnt werden.';
        }
        else if (error.response.data === ErrorCode.TRADE_SET_DELIVERED_ONLY_POSSIBLE_ON_COMPLETED) {
            return 'Nur erfolgreich abgeschlossene Tauschgeschäfte können ausgeliefert werden.';
        }
        else if (error.response.data === ErrorCode.TRADE_DOES_NOT_EXIST) {
            return 'Das Tauschgeschäft existiert nicht.';
        }
        else if (error.response.data === ErrorCode.TRADE_ONLY_EDITABLE_BY_TRADE_PARTNER) {
            return 'Das Tauschgeschäft kann nur von den Parteien dieses Tauschgeschäfts bearbeitet werden.';
        }
        else if (error.response.data === ErrorCode.TRADE_STATE_NOT_SUPPORTED) {
            return 'Dieser Status des Tauschgeschäfts wird nicht unterstützt.';
        }
        else if (error.response.data === ErrorCode.TRADE_NO_TRADE_PARTNER_FOUND) {
            return 'Es wurden keine Parteien im Tauschgeschäft gefunden.';//At least one article must belong to someone other than the caller
        }
    }
    return error.response.statusText;
};
