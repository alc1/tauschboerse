import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import './client/styles.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import store from './client/store/store';
import App from './client/App';

const provider = (
    <MuiThemeProvider>
        <Provider store={store}>
            <App/>
        </Provider>
    </MuiThemeProvider>
);

ReactDOM.render(provider, document.getElementById('root'));
