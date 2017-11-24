import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';

import InputComponent from '../components/InputComponent';

import './UserDetailsForm.css';

const passwordCheckboxStyles = { width: '90%' };

export default class UserDetailsForm extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        currentPassword: PropTypes.string.isRequired,
        newPassword: PropTypes.string.isRequired,
        passwordConfirmation: PropTypes.string.isRequired,
        changePassword: PropTypes.bool.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onPasswordChangeChecked: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { name, email, currentPassword, newPassword, passwordConfirmation, changePassword, errors, loading, onChange, onPasswordChangeChecked, onSubmit } = this.props;
        return (
            <form className="user-details-form__field-container" onSubmit={onSubmit}>
                <InputComponent
                    inputRef={inputElement => this.firstInputElement = inputElement}
                    error={errors.name}
                    label="Name"
                    onChange={onChange}
                    value={name}
                    field="name"
                    disabled={loading}
                />
                <InputComponent
                    error={errors.email}
                    label="E-Mail"
                    onChange={onChange}
                    value={email}
                    field="email"
                    disabled={loading}
                />
                <br/>
                <Checkbox
                    style={passwordCheckboxStyles}
                    label="Passwort ändern"
                    checked={changePassword}
                    onCheck={onPasswordChangeChecked}
                />
                {changePassword && <InputComponent
                    error={errors.currentPassword}
                    label="Bisheriges Passwort"
                    onChange={onChange}
                    value={currentPassword}
                    field="currentPassword"
                    type="password"
                    disabled={loading}
                />}
                {changePassword && <InputComponent
                    error={errors.newPassword}
                    label="Neues Passwort"
                    onChange={onChange}
                    value={newPassword}
                    field="newPassword"
                    type="password"
                    disabled={loading}
                />}
                {changePassword && <InputComponent
                    error={errors.passwordConfirmation}
                    label="Neues Passwort bestätigen"
                    onChange={onChange}
                    value={passwordConfirmation}
                    field="passwordConfirmation"
                    type="password"
                    disabled={loading}
                />}
                <br/>
                {this.props.children}
            </form>
        );
    }
}
