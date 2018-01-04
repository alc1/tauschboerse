import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import RegistrationIcon from 'material-ui/svg-icons/social/person-add';

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
                <Paper className="intro-actions__action-box">
                    <h2 className="intro-actions__action-title">Marktplatz</h2>
                    <span>Du kannst den Marktplatz als Gast durchstöbern und alle Artikel ansehen.</span>
                    <RaisedButton data-button-id="marketplace" style={buttonStyle} label="Zum Marktplatz" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')}/>
                </Paper>
                <Paper className="intro-actions__action-box">
                    <h2 className="intro-actions__action-title">Anmelden</h2>
                    <span>Melde Dich an, wenn Du deine Artikel tauschen möchtest.</span>
                    <RaisedButton data-button-id="login" style={buttonStyle} label="Anmelden" icon={<LoginIcon/>} onClick={this.goTo.bind(this, '/login')} primary/>
                </Paper>
                <Paper className="intro-actions__action-box">
                    <h2 className="intro-actions__action-title">Registrieren</h2>
                    <span>Du bist noch nicht registriert?</span>
                    <RaisedButton data-button-id="registration" style={buttonStyle} label="Registrieren" icon={<RegistrationIcon/>} onClick={this.goTo.bind(this, '/registration')} secondary/>
                </Paper>
            </div>
        );
    }
}
