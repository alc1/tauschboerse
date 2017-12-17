import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';
import { orange500 } from 'material-ui/styles/colors';

import { GO_TO_LOGIN, OK_MESSAGE, WARNING_MESSAGE, ERROR_MESSAGE } from '../../store/actions/application';

export default class GlobalMessage extends React.Component {

    static propTypes = {
        globalMessage: PropTypes.object.isRequired,
        removeGlobalMessage: PropTypes.func.isRequired,
        goToLogin: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        muiTheme: PropTypes.shape({
            palette: PropTypes.shape({
                primary1Color: PropTypes.string.isRequired,
                accent1Color: PropTypes.string.isRequired,
            }).isRequired
        }).isRequired
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
                this.props.removeGlobalMessage();
                this.props.goToLogin(this.props.history);
            }
        }

        let borderColor = 'black';
        if (messageType === OK_MESSAGE) {
            borderColor = this.props.muiTheme.palette.primary1Color;
        }
        else if (messageType === WARNING_MESSAGE) {
            borderColor = orange500;
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
                onActionClick={action}
                onRequestClose={this.props.removeGlobalMessage}
                autoHideDuration={messageType === OK_MESSAGE ? 2000 : 0}
            />
        );
    }
}
