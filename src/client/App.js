import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';

import NavigationComponent from './components/NavigationComponent';
import HomePage from './containers/HomePage';
import MarketplacePage from './containers/MarketplacePage';
import UserArticlesPage from './containers/UserArticlesPage';
import UserDetailsPage from './containers/UserDetailsPage';
import UserTransactionsPage from './containers/UserTransactionsPage';
import ArticleDetailPage from './containers/ArticleDetailPage';
import RegistrationPage from './containers/RegistrationPage';
import LoginPage from './containers/LoginPage';
import NoMatchPage from './containers/NoMatchPage';

import PrivateRoute from './route/PrivateRoute';
import PublicRoute from './route/PublicRoute';

import { getUser } from './selectors/user';
import { logout } from './actions/user';

class App extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    state = {
        isMenuOpen: false
    };

    onLogin = () => {
        this.props.history.push('/login');
    };

    onLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    };

    toggleMenu = () => {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    };

    closeMenu = () => {
        this.setState({
            isMenuOpen: false
        });
    };

    handleMenuChange = (open) => {
        this.setState({
            isMenuOpen: open
        });
    };

    render() {
        let loginButtonBar;
        if (this.props.user) {
            loginButtonBar = <FlatButton label="Logout" onClick={this.onLogout}/>;
        }
        else {
            loginButtonBar = <FlatButton label="Login" onClick={this.onLogin}/>;
        }

        const ContentWrapper = styled.div`
            padding-top: 64px;
        `;

        return (
            <div>
                <AppBar style={{position: 'fixed'}} title="Tauschbörse" iconElementLeft={<IconButton><Menu/></IconButton>} iconElementRight={loginButtonBar} onLeftIconButtonTouchTap={this.toggleMenu}/>
                <Drawer docked={false} open={this.state.isMenuOpen} onRequestChange={this.handleMenuChange}>
                    <NavigationComponent closeMenu={this.closeMenu}/>
                </Drawer>
                <ContentWrapper>
                    <Switch>
                        <Route exact path="/" component={HomePage}/>
                        <Route exact path="/marketplace" component={MarketplacePage}/>
                        <Route exact path="/article/:articleId" component={ArticleDetailPage}/>
                        <PublicRoute exact path="/registration" component={RegistrationPage}/>
                        <PublicRoute exact path="/login" component={LoginPage}/>
                        <PrivateRoute exact path="/user/:userId/transactions" component={UserTransactionsPage}/>
                        <PrivateRoute exact path="/user/:userId/articles" component={UserArticlesPage}/>
                        <PrivateRoute exact path="/user/:userId/details" component={UserDetailsPage}/>
                        <Route component={NoMatchPage}/>
                    </Switch>
                </ContentWrapper>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(App));
