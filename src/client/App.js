import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from './containers/HomePage';
import MarketplacePage from './containers/MarketplacePage';
import UserArticlesPage from './containers/UserArticlesPage';
import UserEditorPage from './containers/UserEditorPage';
import UserTradesPage from './containers/UserTradesPage';
import ArticleEditorPage from './containers/ArticleEditorPage';
import TradeDetailPage from './containers/TradeDetailPage';
import RegistrationPage from './containers/RegistrationPage';
import LoginPage from './containers/LoginPage';
import NoMatchPage from './containers/NoMatchPage';

import PrivateRoute from './containers/PrivateRoute';
import PublicRoute from './containers/PublicRoute';

import store from '../client/store/store';

import './App.css';

const history = createBrowserHistory();

export default class App extends React.Component {

    render() {
        return (
            <MuiThemeProvider>
                <Provider store={store}>
                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={HomePage}/>
                            <Route path="/marketplace" component={MarketplacePage}/>
                            <Route exact path="/article" component={ArticleEditorPage}/>
                            <Route exact path="/article/:articleId" component={ArticleEditorPage}/>
                            <Route exact path="/trade/:tradeId" component={TradeDetailPage}/>
                            <PublicRoute exact path="/registration" component={RegistrationPage}/>
                            <PublicRoute exact path="/login" component={LoginPage}/>
                            <PrivateRoute path="/user/:userId/articles" component={UserArticlesPage}/>
                            <PrivateRoute exact path="/user/:userId/trades" component={UserTradesPage}/>
                            <PrivateRoute exact path="/user/:userId/details" component={UserEditorPage}/>
                            <Route component={NoMatchPage}/>
                        </Switch>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
