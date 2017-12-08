import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';

import NavigationContainer from '../containers/NavigationContainer';
import LoadingIndicatorContainer from '../containers/LoadingIndicatorContainer';
import GlobalMessage from '../containers/GlobalMessage';

import { getUser } from '../selectors/user';
import { logout } from '../actions/user';

import './ApplicationBar.css';

const appbarStyles = {
    position: 'fixed',
    zIndex: 10
};

class ApplicationBar extends React.Component {

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
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    };

    closeMenu = () => {
        this.setState({ isMenuOpen: false });
    };

    handleMenuChange = (open) => {
        this.setState({ isMenuOpen: open });
    };

    render() {
        let loginButtonBar;
        if (this.props.user) {
            loginButtonBar = <FlatButton label="Logout" onClick={this.onLogout}/>;
        }
        else {
            loginButtonBar = <FlatButton label="Login" onClick={this.onLogin}/>;
        }

        return (
            <div>
                <AppBar
                    style={appbarStyles}
                    className="appbar"
                    title="Tauschbörse"
                    iconElementLeft={<IconButton><Menu/></IconButton>}
                    iconElementRight={loginButtonBar}
                    onLeftIconButtonTouchTap={this.toggleMenu}/>
                <Drawer
                    docked={false}
                    open={this.state.isMenuOpen}
                    onRequestChange={this.handleMenuChange}>
                    <NavigationContainer closeMenu={this.closeMenu}/>
                </Drawer>
                <div className="appbar__content"/>
                <LoadingIndicatorContainer/>
                <GlobalMessage/>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default withRouter(connect(mapStateToProps, { logout })(ApplicationBar));
