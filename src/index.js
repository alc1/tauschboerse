import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import './client/styles.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import store from './client/store/store';
import history from './client/history/history';
import App from './client/App';

const provider = (
    <MuiThemeProvider>
        <Provider store={store}>
            <BrowserRouter history={history}>
                <App/>
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>
);

ReactDOM.render(provider, document.getElementById('root'));
