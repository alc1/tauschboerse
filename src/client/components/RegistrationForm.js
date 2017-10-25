import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from '../components/InputComponent';

export default class UserDetailsForm extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        passwordConfirmation: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    render() {
        const { name, email, password, passwordConfirmation, errors, loading, onChange, onSubmit } = this.props;
        const inputStyles = { width: '350px' };
        const formStyles = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };
        return (
            <form style={formStyles} onSubmit={onSubmit}>
                <InputComponent
                    style={inputStyles}
                    error={errors.name}
                    label="Name"
                    onChange={onChange}
                    value={name}
                    field="name"
                    disabled={loading}
                />
                <InputComponent
                    style={inputStyles}
                    error={errors.email}
                    label="E-Mail"
                    onChange={onChange}
                    value={email}
                    field="email"
                    disabled={loading}
                />
                <InputComponent
                    style={inputStyles}
                    error={errors.password}
                    label="Passwort"
                    onChange={onChange}
                    value={password}
                    field="password"
                    type="password"
                    disabled={loading}
                />
                <InputComponent
                    style={inputStyles}
                    error={errors.passwordConfirmation}
                    label="Passwort bestätigen"
                    onChange={onChange}
                    value={passwordConfirmation}
                    field="passwordConfirmation"
                    type="password"
                    disabled={loading}
                />
                <br/>
                {this.props.children}
            </form>
        );
    }
}
