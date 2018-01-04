import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import RegistrationIcon from 'material-ui/svg-icons/social/person-add';

import ActionBox from '../ActionBox/ActionBox';

import './IntroActions.css';

const buttonStyle = { margin: '10px' };

export default class IntroActions extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    goTo = (thePath) => {
        this.props.history.push(thePath);
    };

    render() {
        return (
            <div className="intro-actions">
                <ActionBox title="Marktplatz" text="Du kannst den Marktplatz als Gast durchstöbern und alle Artikel ansehen.">
                    <RaisedButton data-button-id="marketplace" style={buttonStyle} label="Zum Marktplatz" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')}/>
                </ActionBox>
                <ActionBox title="Anmelden" text="Melde Dich an, wenn Du deine Artikel tauschen möchtest.">
                    <RaisedButton data-button-id="login" style={buttonStyle} label="Anmelden" icon={<LoginIcon/>} onClick={this.goTo.bind(this, '/login')} primary/>
                </ActionBox>
                <ActionBox title="Registrieren" text="Du bist noch nicht registriert? Dann erstelle jetzt dein Benutzerkonto.">
                    <RaisedButton data-button-id="registration" style={buttonStyle} label="Registrieren" icon={<RegistrationIcon/>} onClick={this.goTo.bind(this, '/registration')} secondary/>
                </ActionBox>
            </div>
        );
    }
}
