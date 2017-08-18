import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';

import store from './client/store/store';
import App from './client/App';

const provider = (
    <Provider store={store}>
        <App/>
    </Provider>
);

ReactDOM.render(provider, document.getElementById('root'));
