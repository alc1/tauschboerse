import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import HomePage from './containers/HomePage';
import MarketplacePage from './containers/MarketplacePage';
import UserArticlesPage from './containers/UserArticlesPage';
import UserDetailsPage from './containers/UserDetailsPage';
import UserTransactionsPage from './containers/UserTransactionsPage';
import ArticleDetailPage from './containers/ArticleDetailPage';
import ArticleEditorPage from './containers/ArticleEditorPage';
import RegistrationPage from './containers/RegistrationPage';
import LoginPage from './containers/LoginPage';
import NoMatchPage from './containers/NoMatchPage';

import PrivateRoute from './route/PrivateRoute';
import PublicRoute from './route/PublicRoute';

import { getUser } from './selectors/user';
import { logout } from './actions/user';

class App extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route exact path="/marketplace" component={MarketplacePage}/>
                <Route exact path="/article/:articleId" component={ArticleDetailPage}/>
                <PublicRoute exact path="/registration" component={RegistrationPage}/>
                <PublicRoute exact path="/login" component={LoginPage}/>
                <PrivateRoute exact path="/user/:userId/transactions" component={UserTransactionsPage}/>
                <PrivateRoute exact path="/user/:userId/articles" component={UserArticlesPage}/>
                <PrivateRoute exact path="/user/:userId/details" component={UserDetailsPage}/>
                <PrivateRoute exact path="/user/:userId/article" component={ArticleEditorPage}/>
                <PrivateRoute exact path="/user/:userId/article/:articleId" component={ArticleEditorPage}/>
                <Route component={NoMatchPage}/>
            </Switch>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(App));
