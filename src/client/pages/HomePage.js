import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationBar from '../containers/ApplicationBar';
import Dashboard from '../containers/Dashboard';
import Intro from '../containers/Intro';

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
                {!user ? (
                    <Intro/>
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

export default connect(mapStateToProps)(HomePage);
