/*
 * This is a wrapper around an API server call. This allows us to handle things which
 * applies to each server call, such as updating the loading state in the application.
 */

import axios from 'axios';

import { loadingStateReceived } from '../store/actions/application';
import store from '../store/store';

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';

export function execute(theMethod, thePath, thePayload) {
    store.dispatch(loadingStateReceived(true));
    let request;
    switch (theMethod) {
        case GET:
            request = axios.get(thePath, thePayload);
            break;
        case POST:
            request = axios.post(thePath, thePayload);
            break;
        case PUT:
            request = axios.put(thePath, thePayload);
            break;
        case DELETE:
            request = axios.delete(thePath, thePayload);
            break;
        default:
            store.dispatch(loadingStateReceived(false));
            throw new Error('Unsupported method provided');
    }
    return request.then(response => {
        store.dispatch(loadingStateReceived(false));
        return response;
    }).catch(error => {
        store.dispatch(loadingStateReceived(false));
        throw error;
    });
}
