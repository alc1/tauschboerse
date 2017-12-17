import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import RegistrationIcon from 'material-ui/svg-icons/social/person-add';

import Swap from '../../images/Swap';
import Camera from '../../images/Camera';
import Flower from '../../images/Flower';
import Bike from '../../images/Bike';
import Toys from '../../images/Toys';
import Watch from '../../images/Watch';
import Tablet from '../../images/Tablet';

import './Intro.css';

const buttonStyle = { margin: '10px' };
const swapCircleStyle = { margin: '10px' };

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
                        <Camera className="intro__image1"/>
                        <Flower className="intro__image2"/>
                        <Bike className="intro__image3"/>
                    </div>
                    <Paper zDepth={3} circle style={swapCircleStyle}>
                        <Swap className="intro__swap-image"/>
                    </Paper>
                    <div className="intro__images-group">
                        <Toys className="intro__image3"/>
                        <Watch className="intro__image2"/>
                        <Tablet className="intro__image1"/>
                    </div>
                </div>
                <RaisedButton style={buttonStyle} label="Marktplatz durchstöbern" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')} primary/>
                <span className="intro__text" style={{ fontFamily: fontFamily }}>Melde Dich an, wenn Du deine Artikel tauschen möchtest.</span>
                <Paper className="intro__account-buttons-bar">
                    <RaisedButton style={buttonStyle} label="Anmelden" icon={<LoginIcon/>} onClick={this.goTo.bind(this, '/login')} primary/>
                    <span>Hast Du noch kein Benutzerkonto?</span>
                    <RaisedButton style={buttonStyle} label="Neues Konto erstellen" icon={<RegistrationIcon/>} onClick={this.goTo.bind(this, '/registration')} secondary/>
                </Paper>
            </div>
        );
    }
}
