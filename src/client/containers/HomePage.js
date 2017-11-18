import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import ApplicationBar from '../components/ApplicationBar';
import GlobalMessageComponent from '../components/GlobalMessageComponent';

import { getUser } from '../selectors/user';

class HomePage extends React.Component {

    static propTypes = {
        user: PropTypes.object
    };

    render() {
        const { user } = this.props;
        return (
            <div>
                <ApplicationBar/>
                {user ?
                    <div>
                        <div>Angemeldet als:</div>
                        <div>Name: {`${user.name}`}</div>
                        <div>E-Mail: {`${user.email}`}</div>
                        <div>Mitglied seit: {`${moment(user.registration).format('DD.MM.YYYY HH:mm:ss')}`}</div>
                        <div>ID: {`${user._id}`}</div>
                    </div>
                    :
                    <div>
                        Nicht angemeldet!
                    </div>
                }
                <GlobalMessageComponent/>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default connect(mapStateToProps)(HomePage);
