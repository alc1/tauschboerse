import React from 'react';
import PropTypes from 'prop-types';

import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import InputComponent from '../components/InputComponent';

import './UserPasswordForm.css';

const toolbarTitleStyle = { color: 'black' };

export default class UserDetailsForm extends React.Component {

    static propTypes = {
        userDetails: PropTypes.shape({
            changePassword: PropTypes.bool.isRequired,
            currentPassword: PropTypes.string.isRequired,
            newPassword: PropTypes.string.isRequired,
            passwordConfirmation: PropTypes.string.isRequired
        }).isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onPasswordChangeChecked: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    render() {
        const { userDetails, errors, loading, onChange, onPasswordChangeChecked, onSubmit } = this.props;
        const { changePassword, currentPassword, newPassword, passwordConfirmation } = userDetails;
        return (
            <div className="user-password-form__container">
                <Paper className="user-password-form__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Passwort"/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <Toggle
                                label="Passwort ändern"
                                labelPosition="right"
                                toggled={changePassword}
                                onToggle={onPasswordChangeChecked}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                    {changePassword &&
                        <div className="user-password-form__field-container" onSubmit={onSubmit}>
                            <InputComponent
                                inputRef={inputElement => this.firstInputElement = inputElement}
                                error={errors.currentPassword}
                                label="Bisheriges Passwort"
                                onChange={onChange}
                                value={currentPassword}
                                field="currentPassword"
                                type="password"
                                disabled={loading}/>
                            <InputComponent
                                error={errors.newPassword}
                                label="Neues Passwort"
                                onChange={onChange}
                                value={newPassword}
                                field="newPassword"
                                type="password"
                                disabled={loading}/>
                            <InputComponent
                                error={errors.passwordConfirmation}
                                label="Neues Passwort bestätigen"
                                onChange={onChange}
                                value={passwordConfirmation}
                                field="passwordConfirmation"
                                type="password"
                                disabled={loading}/>
                        </div>
                    }
                </Paper>
            </div>
        );
    }
}
