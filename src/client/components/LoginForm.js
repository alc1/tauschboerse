import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from '../components/InputComponent';

export default class LoginForm extends React.Component {

    static propTypes = {
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { email, password, errors, loading, onChange, onSubmit } = this.props;
        const inputStyles = { width: '350px' };
        const formStyles = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };
        return (
            <form style={formStyles} onSubmit={onSubmit}>
                <InputComponent
                    inputRef={inputElement => this.firstInputElement = inputElement}
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
                <br/>
                {this.props.children}
            </form>
        );
    }
}
