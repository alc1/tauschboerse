import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import GlobaleMessageComponent from '../components/GlobalMessageComponent';

import { removeGlobalMessage, goToLogin } from '../actions/application';
import { getGlobalMessage } from '../selectors/application';

class GlobalMessageContainer extends React.Component {

    static propTypes = {
        globalMessage: PropTypes.object.isRequired,
        removeGlobalMessage: PropTypes.func.isRequired,
        goToLogin: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    onGlobalMessageClose = () => {
        this.props.removeGlobalMessage();
    };

    render() {
        const { globalMessage, goToLogin, history } = this.props;
        return (
            <GlobaleMessageComponent
                globalMessage={globalMessage}
                onGlobalMessageClose={this.onGlobalMessageClose}
                goToLogin={goToLogin}
                history={history}/>
        );
    }
}

function mapStateToProps(theState) {
    return {
        globalMessage: getGlobalMessage(theState)
    };
}

export default withRouter(connect(mapStateToProps, { removeGlobalMessage, goToLogin })(GlobalMessageContainer));
