import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

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

import { getUser } from './store/user';
import * as Actions from './actions/actions';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: true
        };
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    onToggleMenu() {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    }

    onLogin() {
        this.props.history.push('/login');
    }

    onLogout() {
        this.props.logout();
        this.props.history.push('/');
    }

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
                <Route exact path="/" component={HomePage}/>
                <Route exact path="/marketplace" component={MarketplacePage}/>
                <Route exact path="/user/:userId/transactions" component={UserTransactionsPage}/>
                <Route exact path="/user/:userId/articles" component={UserArticlesPage}/>
                <Route exact path="/user/:userId/details" component={UserDetailsPage}/>
                <Route exact path="/article/:articleId" component={ArticleDetailPage}/>
                <Route exact path="/registration" component={RegistrationPage}/>
                <Route exact path="/login" component={LoginPage}/>
            </div>
        );
    }
}

App.propTypes = {
    history: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
