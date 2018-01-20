import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';

import PlusIcon from 'material-ui/svg-icons/content/add';
import ArticlesIcon from 'material-ui/svg-icons/action/list';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import ActionBox from '../ActionBox/ActionBox';

import './DashboardActions.css';

const buttonStyle = { marginLeft: '10px', marginRight: '10px', marginBottom: '10px' };

export default class DashboardActions extends React.Component {

    static propTypes = {
        gotoUserTradesPage: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    };

    goTo = (thePath) => {
        this.props.history.push(thePath);
    };

    render() {
        const { history, user } = this.props;

        return (
            <div className="dashboard-actions">
                <ActionBox title="Marktplatz" text="Durchstöbere den Marktplatz und finde, was Du schon immer gesucht hast.">
                    <RaisedButton data-button-id="marketplace" style={buttonStyle} label="Zum Marktplatz" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')}/>
                </ActionBox>
                <ActionBox title="Tauschgeschäfte" text="Verwalte hier deine Tauschgeschäfte.">
                    <RaisedButton data-button-id="user-trades" style={buttonStyle} label="Meine Tauschgeschäfte" icon={<SwapIcon/>} onClick={this.props.gotoUserTradesPage.bind(this, history, user._id)} primary/>
                </ActionBox>
                <ActionBox title="Artikel" text="Verwalte hier deine Artikel.">
                    <RaisedButton data-button-id="new-article" style={buttonStyle} label="Neuer Artikel erfassen" icon={<PlusIcon/>} onClick={this.goTo.bind(this, '/article')}/>
                    <RaisedButton data-button-id="user-articles" style={buttonStyle} label="Meine Artikel" icon={<ArticlesIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/articles`)} primary/>
                </ActionBox>
                <ActionBox title="Benutzerkonto" text="Verwalte hier dein Benutzerkonto.">
                    <RaisedButton data-button-id="account" style={buttonStyle} label="Mein Konto" icon={<SettingsIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/details`)} primary/>
                    <RaisedButton data-button-id="logout" style={buttonStyle}  label="Abmelden" icon={<ExitIcon/>} onClick={this.props.logout.bind(this, true)} secondary/>
                </ActionBox>
            </div>
        );
    }
}
