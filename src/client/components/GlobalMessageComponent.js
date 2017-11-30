import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';
import muiThemeable from 'material-ui/styles/muiThemeable';

import { GO_TO_LOGIN, OK_MESSAGE, ERROR_MESSAGE } from '../actions/application';

class GlobalMessageComponent extends React.Component {

    static propTypes = {
        globalMessage: PropTypes.object.isRequired,
        onGlobalMessageClose: PropTypes.func.isRequired,
        goToLogin: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
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
                this.props.onGlobalMessageClose();
                this.props.goToLogin(this.props.history);
            }
        }

        let borderColor = 'black';
        if (messageType === OK_MESSAGE) {
            borderColor = this.props.muiTheme.palette.primary1Color;
        }
        else if (messageType === ERROR_MESSAGE) {
            borderColor = this.props.muiTheme.palette.accent1Color;
        }
        const style = { border: `3px solid ${borderColor}`, borderRadius: '5px' };

        return (
            <Snackbar
                style={style}
                open={openSnackbar}
                message={messageText}
                action={actionText}
                onActionTouchTap={action}
                onRequestClose={this.props.onGlobalMessageClose}
            />
        );
    }
}

export default muiThemeable()(GlobalMessageComponent);
