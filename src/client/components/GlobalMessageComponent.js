import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';

import { getGlobalMessage } from '../selectors/globalMessage';
import { removeGlobalMessage, goToLogin, GO_TO_LOGIN, OK_MESSAGE, ERROR_MESSAGE } from '../actions/globalMessage';

class GlobalMessageComponent extends React.Component {

    static propTypes = {
        globalMessage: PropTypes.object.isRequired,
        removeGlobalMessage: PropTypes.func.isRequired,
        goToLogin: PropTypes.func.isRequired
    };

    closeSnackbar = () => {
        this.props.removeGlobalMessage();
    };

    render() {
        let { messageText, messageType, actionText, actionType } = this.props.globalMessage;
        let openSnackbar;
        if (messageText) {
            openSnackbar = true;
        }
        else {
            openSnackbar = false;
            messageText = '';
        }

        let action;
        if (actionType === GO_TO_LOGIN) {
            action = () => {
                this.props.goToLogin(this.props.history);
                this.closeSnackbar();
            }
        }

        let borderColor = 'black';
        if (messageType === OK_MESSAGE) {
            borderColor = 'green';
        }
        else if (messageType === ERROR_MESSAGE) {
            borderColor = 'red';
        }
        const style = { border: `3px solid ${borderColor}`, borderRadius: '5px' };

        return (
            <Snackbar
                style={style}
                open={openSnackbar}
                message={messageText}
                action={actionText}
                onActionTouchTap={action}
                onRequestClose={this.closeSnackbar}
            />
        );
    }
}

function mapStateToProps(theState) {
    return {
        globalMessage: getGlobalMessage(theState)
    };
}

export default withRouter(connect(mapStateToProps, { removeGlobalMessage, goToLogin })(GlobalMessageComponent));
