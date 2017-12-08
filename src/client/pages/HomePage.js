import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import MarketplaceIcon from 'material-ui/svg-icons/communication/business';
import ListIcon from 'material-ui/svg-icons/action/list';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import NewAccountIcon from 'material-ui/svg-icons/social/person-add';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';

import ApplicationBar from '../containers/ApplicationBar';
import Swap from '../images/Swap';
import Camera from '../images/Camera';
import Flower from '../images/Flower';
import Bike from '../images/Bike';
import Toys from '../images/Toys';
import Watch from '../images/Watch';
import Tablet from '../images/Tablet';

import { logout } from '../actions/user';
import { getUser } from '../selectors/user';

import './HomePage.css';

const buttonStyle = { margin: '10px' };

class HomePage extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
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
                    {user && <span className="homepage__text" style={{ fontFamily: fontFamily }}>Hallo {user.name}</span>}
                    <RaisedButton style={buttonStyle} label="Marktplatz durchstöbern" icon={<MarketplaceIcon/>} onClick={this.goTo.bind(this, '/marketplace')} primary/>
                    {!user && <RaisedButton style={buttonStyle} label="Anmelden" icon={<LoginIcon/>} onClick={this.goTo.bind(this, '/login')} primary/>}
                    {!user && <FlatButton style={buttonStyle} label="Neues Konto erstellen" icon={<NewAccountIcon/>} onClick={this.goTo.bind(this, '/registration')} secondary/>}
                    {user && <RaisedButton style={buttonStyle} label="Meine Artikel anzeigen" icon={<ListIcon/>} onClick={this.goTo.bind(this, `/user/${user._id}/articles`)} primary/>}
                    {user && <RaisedButton style={buttonStyle} label="Abmelden" icon={<ExitIcon/>} onClick={this.props.logout} secondary/>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default muiThemeable()(connect(mapStateToProps, { logout })(HomePage));
