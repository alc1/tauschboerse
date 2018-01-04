import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';

import PlusIcon from 'material-ui/svg-icons/content/add';
import ArticlesIcon from 'material-ui/svg-icons/action/list';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import ActionBox from '../ActionBox/ActionBox';

import './DashboardActions.css';

const buttonStyle = { marginLeft: '10px', marginRight: '10px', marginBottom: '10px' };

export default class DashboardActions extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    goTo = (thePath) => {
        this.props.history.push(thePath);
    };

    render() {
        const { user } = this.props;

        return (
            <div className="dashboard-actions">
                <ActionBox title="Marktplatz" text="Durchstöbere den Marktplatz und finde, was Du schon immer gesucht hast.">
                    <RaisedButton style={buttonStyle} label="Zum Marktplatz" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')}/>
                </ActionBox>
                <ActionBox title="Tauschgeschäfte" text="Verwalte hier deine Tauschgeschäfte.">
                    <RaisedButton style={buttonStyle} label="Meine Tauschgeschäfte" icon={<SwapIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/trades`)} primary/>
                </ActionBox>
                <ActionBox title="Artikel" text="Verwalte hier deine Artikel.">
                    <RaisedButton style={buttonStyle} label="Neuer Artikel erfassen" icon={<PlusIcon/>} onClick={this.goTo.bind(this, '/article')}/>
                    <RaisedButton style={buttonStyle} label="Meine Artikel" icon={<ArticlesIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/articles`)} primary/>
                </ActionBox>
                <ActionBox title="Benutzerkonto" text="Verwalte hier dein Benutzerkonto.">
                    <RaisedButton style={buttonStyle} label="Mein Konto" icon={<AccountIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/details`)} primary/>
                    <RaisedButton data-button-id="logout" style={buttonStyle}  label="Abmelden" icon={<ExitIcon/>} onClick={this.props.logout} secondary/>
                </ActionBox>
            </div>
        );
    }
}
