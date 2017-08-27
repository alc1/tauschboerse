import React from 'react';
import { Link } from 'react-router-dom';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import Home from 'material-ui/svg-icons/action/home';
import Business from 'material-ui/svg-icons/communication/business';
import List from 'material-ui/svg-icons/action/list';
import CompareArrows from 'material-ui/svg-icons/action/compare-arrows';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

class NavigationComponent extends React.Component {
    render() {
        let userTransactionsLink = '/';
        let userArticlesLink = '/';
        let userDetailsLink = '/';
        if (this.props.isLoggedIn) {
            userTransactionsLink = `/user/${this.props.user._id}/transactions`;
            userArticlesLink = `/user/${this.props.user._id}/articles`;
            userDetailsLink = `/user/${this.props.user._id}/details`;
        }

        return (
            <div>
                {this.props.isMenuOpen &&
                <Toolbar>
                    <ToolbarGroup>
                        <Link to="/"><FlatButton label="Home" icon={<Home/>} primary/></Link>
                        <Link to="/marketplace"><FlatButton label="Marktplatz" icon={<Business/>} primary/></Link>
                        {this.props.isLoggedIn && <Link to={userTransactionsLink}><FlatButton label="Tauschgeschäfte" icon={<CompareArrows/>} primary/></Link>}
                        {this.props.isLoggedIn && <Link to={userArticlesLink}><FlatButton label="Meine Artikel" icon={<List/>} primary/></Link>}
                        {this.props.isLoggedIn && <Link to={userDetailsLink}><FlatButton label="Profil" icon={<AccountCircle/>} primary/></Link>}
                        {!this.props.isLoggedIn && <Link to="/registration"><FlatButton label="Registrieren" icon={<PersonAdd/>} primary/></Link>}
                    </ToolbarGroup>
                </Toolbar>}
            </div>
        );
    }
}

export default NavigationComponent;
