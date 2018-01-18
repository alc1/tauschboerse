import React from 'react';
import PropTypes from 'prop-types';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import HomeIcon from 'material-ui/svg-icons/action/home';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import ArticlesIcon from 'material-ui/svg-icons/action/list';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import RegistrationIcon from 'material-ui/svg-icons/social/person-add';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';

import UserInfo from '../../containers/UserInfo';

export default class Navigation extends React.Component {

    static propTypes = {
        closeMenu: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        user: PropTypes.object
    };

    openMenuItem = (theLink) => {
        this.props.closeMenu();
        this.props.history.push(theLink);
    };

    logout = () => {
        this.props.closeMenu();
        this.props.logout(true);
        this.props.history.push('/');
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
        const { user } = this.props;
        let userTradesLink = '/';
        let userArticlesLink = '/';
        let userDetailsLink = '/';
        if (user) {
            userTradesLink = `/user/${user._id}/trades`;
            userArticlesLink = `/user/${user._id}/articles`;
            userDetailsLink = `/user/${user._id}/details`;
        }
        return (
            <div>
                <UserInfo width={100} height={100} user={user}/>
                <Menu autoWidth={false} width={300}>
                    <Divider/>
                    <MenuItem primaryText="Home" leftIcon={<HomeIcon/>} onClick={this.openMenuItem.bind(this, '/')}/>
                    <MenuItem primaryText="Marktplatz" leftIcon={<MarketplaceIcon/>} onClick={this.openMenuItem.bind(this, '/marketplace')}/>
                    <Divider/>
                    {user && <MenuItem primaryText="Tauschgeschäfte" leftIcon={<SwapIcon/>} onClick={this.openMenuItem.bind(this, userTradesLink)}/>}
                    {user && <MenuItem primaryText="Meine Artikel" leftIcon={<ArticlesIcon/>} onClick={this.openMenuItem.bind(this, userArticlesLink)}/>}
                    {user && <MenuItem primaryText="Mein Konto" leftIcon={<SettingsIcon/>} onClick={this.openMenuItem.bind(this, userDetailsLink)}/>}
                    {user && <Divider/>}
                    {user && <MenuItem primaryText="Abmelden" leftIcon={<ExitIcon/>} onClick={this.logout}/>}
                    {!user && <MenuItem primaryText="Anmelden" leftIcon={<LoginIcon/>} onClick={this.goToLogin}/>}
                    {!user && <MenuItem primaryText="Registrieren" leftIcon={<RegistrationIcon/>} onClick={this.openMenuItem.bind(this, '/registration')}/>}
                </Menu>
            </div>
        );
    }
}
