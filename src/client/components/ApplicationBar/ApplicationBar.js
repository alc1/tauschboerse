import React from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import AppTitle from '../AppTitle/AppTitle';
import Navigation from '../../containers/Navigation';
import LoadingIndicator from '../../containers/LoadingIndicator';
import GlobalMessage from '../../containers/GlobalMessage';

import './ApplicationBar.css';

const appbarStyles = {
    position: 'fixed',
    zIndex: 10
};

export default class ApplicationBar extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        user: PropTypes.object,
        subtitle: PropTypes.string
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
        const { subtitle } = this.props;
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
                    titleStyle={{ lineHeight: subtitle ? 'normal' : '64px' }}
                    title={<AppTitle subtitle={subtitle}/>}
                    iconElementLeft={<IconButton><MenuIcon/></IconButton>}
                    iconElementRight={loginButtonBar}
                    onLeftIconButtonClick={this.toggleMenu}/>
                <Drawer
                    docked={false}
                    open={this.state.isMenuOpen}
                    onRequestChange={this.handleMenuChange}>
                    <Navigation closeMenu={this.closeMenu}/>
                </Drawer>
                <div className="appbar__content"/>
                <LoadingIndicator/>
                <GlobalMessage/>
            </div>
        );
    }
}
