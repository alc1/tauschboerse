import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import Menu from 'material-ui/svg-icons/navigation/menu';
import ArrowDropDownCircle from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import NavigationComponent from './components/NavigationComponent';
import HomePage from './containers/HomePage';
import MarketplacePage from './containers/MarketplacePage';
import UserArticlesPage from './containers/UserArticlesPage';
import UserDetailsPage from './containers/UserDetailsPage';
import UserTransactionsPage from './containers/UserTransactionsPage';
import ArticleDetailPage from './containers/ArticleDetailPage';
import RegistrationPage from './containers/RegistrationPage';
import LoginPage from './containers/LoginPage';

import PrivateRoute from './route/PrivateRoute';
import PublicRoute from './route/PublicRoute';

import { getUser } from './store/user';
import * as Actions from './actions/actions';

class App extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    state = {
        isMenuOpen: true
    };

    onToggleMenu = () => {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    };

    onLogin = () => {
        this.props.history.push('/login');
    };

    onLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    };

    render() {
        let loginButtonBar;
        if (this.props.user) {
            loginButtonBar = <FlatButton label="Logout" onClick={this.onLogout}/>;
        }
        else {
            loginButtonBar = <FlatButton label="Login" onClick={this.onLogin}/>;
        }

        let menuIcon;
        if (this.state.isMenuOpen) {
            menuIcon = <IconButton><ArrowDropDownCircle/></IconButton>;
        }
        else {
            menuIcon = <IconButton><Menu/></IconButton>;
        }

        return (
            <div>
                <AppBar title="Tauschbörse" iconElementLeft={menuIcon} iconElementRight={loginButtonBar} onLeftIconButtonTouchTap={this.onToggleMenu}/>
                <NavigationComponent isMenuOpen={this.state.isMenuOpen}/>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/marketplace" component={MarketplacePage}/>
                    <PublicRoute exact path="/registration" component={RegistrationPage}/>
                    <PublicRoute exact path="/login" component={LoginPage}/>
                    <PrivateRoute exact path="/user/:userId/transactions" component={UserTransactionsPage}/>
                    <PrivateRoute exact path="/user/:userId/articles" component={UserArticlesPage}/>
                    <PrivateRoute exact path="/user/:userId/details" component={UserDetailsPage}/>
                    <PrivateRoute exact path="/article/:articleId" component={ArticleDetailPage}/>
                </Switch>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
