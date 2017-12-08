import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import GlobalMessage from '../components/GlobalMessage';

import { removeGlobalMessage, goToLogin } from '../actions/application';
import { getGlobalMessage } from '../selectors/application';

function mapStateToProps(theState) {
    return {
        globalMessage: getGlobalMessage(theState)
    };
}

export default withRouter(connect(mapStateToProps, { removeGlobalMessage, goToLogin })(GlobalMessage));
