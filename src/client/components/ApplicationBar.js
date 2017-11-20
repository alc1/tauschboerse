import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';

import NavigationComponent from './NavigationComponent';

import { getUser } from '../selectors/user';
import { logout } from '../actions/user';

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

        const ContentPositionDiv = styled.div`
            padding-top: 64px;
        `;
        return (
            <div>
                <AppBar
                    style={{position: 'fixed'}}
                    title="Tauschbörse"
                    iconElementLeft={<IconButton><Menu/></IconButton>}
                    iconElementRight={loginButtonBar}
                    onLeftIconButtonTouchTap={this.toggleMenu}/>
                <Drawer
                    docked={false}
                    open={this.state.isMenuOpen}
                    onRequestChange={this.handleMenuChange}>
                    <NavigationComponent closeMenu={this.closeMenu}/>
                </Drawer>
                <ContentPositionDiv/>
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
