import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import UserArticlesPage from './pages/UserArticlesPage';
import UserEditorPage from './pages/UserEditorPage';
import UserTradesPage from './pages/UserTradesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticleEditorPage from './pages/ArticleEditorPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import NoMatchPage from './pages/NoMatchPage';

import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

import store from '../client/store/store';
import history from '../client/history/history';

import './App.css';

export default class App extends React.Component {

    render() {
        return (
            <MuiThemeProvider>
                <Provider store={store}>
                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={HomePage}/>
                            <Route path="/marketplace" component={MarketplacePage}/>
                            <Route exact path="/article/:articleId" component={ArticleDetailPage}/>
                            <PublicRoute exact path="/registration" component={RegistrationPage}/>
                            <PublicRoute exact path="/login" component={LoginPage}/>
                            <PrivateRoute exact path="/user/:userId/trades" component={UserTradesPage}/>
                            <PrivateRoute exact path="/user/:userId/articles" component={UserArticlesPage}/>
                            <PrivateRoute exact path="/user/:userId/details" component={UserEditorPage}/>
                            <PrivateRoute exact path="/user/:userId/article" component={ArticleEditorPage}/>
                            <PrivateRoute exact path="/user/:userId/article/:articleId" component={ArticleEditorPage}/>
                            <Route component={NoMatchPage}/>
                        </Switch>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
