import React from 'react';
import PropTypes from 'prop-types';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Home from 'material-ui/svg-icons/action/home';
import Business from 'material-ui/svg-icons/communication/business';
import List from 'material-ui/svg-icons/action/list';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';

import UserInfo from './UserInfo';

export default class NavigationComponent extends React.Component {

    static propTypes = {
        closeMenu: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        user: PropTypes.object
    };

    openMenuItem = (theLink) => {
        this.props.closeMenu();
        this.props.history.push(theLink);
    };

    onLogout = () => {
        this.props.closeMenu();
        this.props.logout();
        this.props.history.push('/');
    };

    render() {
        const { user } = this.props;
        let userTransactionsLink = '/';
        let userArticlesLink = '/';
        let userDetailsLink = '/';
        if (user) {
            userTransactionsLink = `/user/${user._id}/transactions`;
            userArticlesLink = `/user/${user._id}/articles`;
            userDetailsLink = `/user/${user._id}/details`;
        }
        return (
            <div>
                <UserInfo width={100} height={100} user={user}/>
                <Menu autoWidth={false} width={300}>
                    <Divider/>
                    {!user && <MenuItem primaryText="Anmelden" leftIcon={<LockOpen/>} onClick={this.openMenuItem.bind(this, '/login')}/>}
                    {!user && <MenuItem primaryText="Registrieren" leftIcon={<PersonAdd/>} onClick={this.openMenuItem.bind(this, '/registration')}/>}
                    {!user && <Divider/>}
                    <MenuItem primaryText="Home" leftIcon={<Home/>} onClick={this.openMenuItem.bind(this, '/')}/>
                    <MenuItem primaryText="Marktplatz" leftIcon={<Business/>} onClick={this.openMenuItem.bind(this, '/marketplace')}/>
                    {user && <Divider/>}
                    {user && <MenuItem primaryText="Tauschgeschäfte" leftIcon={<SwapIcon/>} onClick={this.openMenuItem.bind(this, userTransactionsLink)}/>}
                    {user && <MenuItem primaryText="Meine Artikel" leftIcon={<List/>} onClick={this.openMenuItem.bind(this, userArticlesLink)}/>}
                    {user && <MenuItem primaryText="Mein Konto" leftIcon={<AccountCircle/>} onClick={this.openMenuItem.bind(this, userDetailsLink)}/>}
                    {user && <Divider/>}
                    {user && <MenuItem primaryText="Abmelden" leftIcon={<ExitToApp/>} onClick={this.onLogout}/>}
                </Menu>
            </div>
        );
    }
}
