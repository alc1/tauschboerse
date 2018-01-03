import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import RegistrationIcon from 'material-ui/svg-icons/social/person-add';

import Swap from '../_svg/Swap';
import Camera from '../_svg/Camera';
import Flower from '../_svg/Flower';
import Bike from '../_svg/Bike';
import Toys from '../_svg/Toys';
import Watch from '../_svg/Watch';
import Tablet from '../_svg/Tablet';

import './Intro.css';

const buttonStyle = { margin: '10px' };

export default class Intro extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        muiTheme: PropTypes.shape({
            fontFamily: PropTypes.string.isRequired
        }).isRequired
    };

    goTo = (thePath) => {
        this.props.history.push(thePath);
    };

    render() {
        const { fontFamily } = this.props.muiTheme;
        return (
            <div className="intro__container">
                <h1 className="intro__title" style={{ fontFamily: fontFamily }}>Willkommen bei der Tauschbörse!</h1>
                <div className="intro__image-container">
                    <div className="intro__images-group">
                        <Camera className="intro__small-image intro__image--animation"/>
                        <Flower className="intro__medium-image intro__image--animation"/>
                        <Bike className="intro__large-image intro__image--animation"/>
                    </div>
                    <Paper className="intro__swap-image-wrapper" zDepth={3} circle>
                        <Swap className="intro__swap-image intro__image--animation"/>
                    </Paper>
                    <div className="intro__images-group">
                        <Toys className="intro__large-image intro__image--animation"/>
                        <Watch className="intro__medium-image intro__image--animation"/>
                        <Tablet className="intro__small-image intro__image--animation"/>
                    </div>
                </div>
                <div className="intro__options-bar">
                    <Paper className="intro__option-box">
                        <h2 className="intro__subtitle">Marktplatz</h2>
                        <span>Du kannst den Marktplatz als Gast durchstöbern und alle Artikel ansehen.</span>
                        <RaisedButton style={buttonStyle} label="Zum Marktplatz" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')}/>
                    </Paper>
                    <Paper className="intro__option-box">
                        <h2 className="intro__subtitle">Anmelden</h2>
                        <span>Melde Dich an, wenn Du deine Artikel tauschen möchtest.</span>
                        <RaisedButton data-button-id="login" style={buttonStyle} label="Anmelden" icon={<LoginIcon/>} onClick={this.goTo.bind(this, '/login')} primary/>
                    </Paper>
                    <Paper className="intro__option-box">
                        <h2 className="intro__subtitle">Registrieren</h2>
                        <span>Du bist noch nicht registriert?</span>
                        <RaisedButton data-button-id="registration" style={buttonStyle} label="Registrieren" icon={<RegistrationIcon/>} onClick={this.goTo.bind(this, '/registration')} secondary/>
                    </Paper>
                </div>
            </div>
        );
    }
}
