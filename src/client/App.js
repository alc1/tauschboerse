import React from 'react';
import { Route } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import NavigationComponent from './components/NavigationComponent';
import HomePage from './containers/HomePage';
import MarketplacePage from './containers/MarketplacePage';
import UserArticlesPage from './containers/UserArticlesPage';
import UserDetailsPage from './containers/UserDetailsPage';
import UserTransactionsPage from './containers/UserTransactionsPage';
import ArticleDetailPage from './containers/ArticleDetailPage';
import RegistrationPage from './containers/RegistrationPage';
import LoginPage from './containers/LoginPage';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: true,
            isLoggedIn: false,
            user: null
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
    }

    toggleMenu() {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    }

    toggleLogin() {
        this.setState({
            isLoggedIn: !this.state.isLoggedIn,
            user: {
                _id: 'ph63KF1MYC8IZxfl',
                name: 'Max Mustermann'
            }
        });
    }

    render() {
        let loginButtonBar;
        if (this.state.isLoggedIn) {
            loginButtonBar = <FlatButton label="Logout" onClick={this.toggleLogin}/>;
        }
        else {
            loginButtonBar = <FlatButton label="Login" onClick={this.toggleLogin}/>;
        }
        return (
            <div>
                <AppBar title="Tauschbörse" iconElementRight={loginButtonBar} onLeftIconButtonTouchTap={this.toggleMenu}/>
                <NavigationComponent isMenuOpen={this.state.isMenuOpen} isLoggedIn={this.state.isLoggedIn} user={this.state.user}/>
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

export default App;
