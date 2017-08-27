import React from 'react';
/*import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Actions from '../actions/actions';*/

class UserDetailsPage extends React.Component {

    /*componentDidMount() {
        const { userId } = this.props.match.params;
        this.props.loadUser(userId);
    }*/

    render() {
        return (
            <div>
                {`User details for user ID: ${this.props.match.params.userId}`}
            </div>
        );
    }
}

export default UserDetailsPage;
