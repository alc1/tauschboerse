import React from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';

import { cyan400, white } from 'material-ui/styles/colors';

import AppTitle from '../../containers/AppTitle';
import Navigation from '../../containers/Navigation';
import LoadingIndicator from '../../containers/LoadingIndicator';
import GlobalMessage from '../../containers/GlobalMessage';
import AvatarTag from '../AvatarTag/AvatarTag';

import './ApplicationBar.css';

const appbarStyles = {
    position: 'fixed',
    zIndex: 10
};

export default class ApplicationBar extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        user: PropTypes.object,
        subtitle: PropTypes.string
    };

    state = {
        isMenuOpen: false
    };

    goTo = (thePath) => {
        this.props.history.push(thePath);
    };

    logout = () => {
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

    createUserMenu = () => {
        const { user } = this.props;
        return (
            <IconMenu iconButtonElement={<AvatarTag backgroundColor={cyan400} labelColor={white} text={user.name} icon={<AccountIcon/>}/>}>
                <MenuItem primaryText="Mein Konto" leftIcon={<SettingsIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/details`)}/>
                <Divider/>
                <MenuItem primaryText="Abmelden" leftIcon={<ExitIcon/>} onClick={this.logout}/>
            </IconMenu>
        );
    };

    goToLogin = () => {
        const { location } = this.props;
        const to = {
            pathname: '/login',
            state: { from: location.pathname + location.search }
        };
        this.props.history.push(to);
    };

    render() {
        const { subtitle } = this.props;
        let loginButtonBar;
        if (this.props.user) {
            loginButtonBar = this.createUserMenu();
        }
        else {
            loginButtonBar = <FlatButton label="Anmelden" onClick={this.goToLogin}/>;
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
