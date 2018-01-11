import axios from 'axios';

import { loadingStateReceived } from '../store/actions/application';
import store from '../store/store';

export const setupApiInterceptors = () => {
    axios.interceptors.request.use((config) => {
        store.dispatch(loadingStateReceived(true));
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    axios.interceptors.response.use((response) => {
        store.dispatch(loadingStateReceived(false));
        return response;
    }, (error) => {
        store.dispatch(loadingStateReceived(false));
        return Promise.reject(error);
    });
};

export const setApiToken = (theToken) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${theToken}`;
};

export const removeApiToken = () => {
    delete axios.defaults.headers.common['Authorization'];
};
