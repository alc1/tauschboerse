import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from '../components/InputComponent';

import './LoginForm.css';

export default class LoginForm extends React.Component {

    static propTypes = {
        email: PropTypes.string.isRequired,
        currentPassword: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { email, currentPassword, errors, loading, onChange, onSubmit } = this.props;
        return (
            <form className="login-form__field-container" onSubmit={onSubmit}>
                <InputComponent
                    inputRef={inputElement => this.firstInputElement = inputElement}
                    error={errors.email}
                    label="E-Mail"
                    onChange={onChange}
                    value={email}
                    field="email"
                    disabled={loading}
                />
                <InputComponent
                    error={errors.currentPassword}
                    label="Passwort"
                    onChange={onChange}
                    value={currentPassword}
                    field="currentPassword"
                    type="password"
                    disabled={loading}
                />
                <br/>
                {this.props.children}
            </form>
        );
    }
}
