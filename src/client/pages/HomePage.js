import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import NewAccountIcon from 'material-ui/svg-icons/social/person-add';

import ApplicationBar from '../containers/ApplicationBar';
import Dashboard from '../containers/Dashboard';
import Swap from '../images/Swap';
import Camera from '../images/Camera';
import Flower from '../images/Flower';
import Bike from '../images/Bike';
import Toys from '../images/Toys';
import Watch from '../images/Watch';
import Tablet from '../images/Tablet';

import { getUser } from '../selectors/user';

import './HomePage.css';

const buttonStyle = { margin: '10px' };

class HomePage extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        user: PropTypes.object
    };

    goTo = (thePath) => {
        this.props.history.push(thePath);
    };

    render() {
        const { user } = this.props;
        const { fontFamily } = this.props.muiTheme;
        return (
            <div>
                <ApplicationBar/>
                {!user ? (
                        <div className="homepage__container">
                            <h1 className="homepage__title" style={{ fontFamily: fontFamily }}>Willkommen bei der Tauschbörse!</h1>
                            <div className="homepage__image-container">
                                <div className="homepage__images-group">
                                    <Camera className="homepage__image1"/>
                                    <Flower className="homepage__image2"/>
                                    <Bike className="homepage__image3"/>
                                </div>
                                <Paper zDepth={3} circle style={{ margin: '10px' }}>
                                    <Swap className="homepage__swap-image"/>
                                </Paper>
                                <div className="homepage__images-group">
                                    <Toys className="homepage__image3"/>
                                    <Watch className="homepage__image2"/>
                                    <Tablet className="homepage__image1"/>
                                </div>
                            </div>
                            <RaisedButton style={buttonStyle} label="Marktplatz durchstöbern" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')} primary/>
                            <RaisedButton style={buttonStyle} label="Anmelden" icon={<LoginIcon/>} onClick={this.goTo.bind(this, '/login')} primary/>
                            <FlatButton style={buttonStyle} label="Neues Konto erstellen" icon={<NewAccountIcon/>} onClick={this.goTo.bind(this, '/registration')} secondary/>
                        </div>
                ) : (
                    <Dashboard user={user}/>
                )}
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default muiThemeable()(connect(mapStateToProps)(HomePage));
