import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';

import InputComponent from '../InputComponent/InputComponent';

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
            <div className="login-form__container">
                <Paper className="login-form__paper">
                    <h1 className="login-form__title">Melde Dich mit deiner E-Mail-Adresse an:</h1>
                    <form className="login-form__field-container" onSubmit={onSubmit}>
                        <InputComponent
                            setElementRef={element => this.firstInputElement = element}
                            error={errors.email}
                            label="E-Mail *"
                            onChange={onChange}
                            value={email}
                            field="email"
                            disabled={loading}/>
                        <InputComponent
                            error={errors.currentPassword}
                            label="Passwort *"
                            onChange={onChange}
                            value={currentPassword}
                            field="currentPassword"
                            type="password"
                            disabled={loading}/>
                        <span className="login-form__hint-text">* Obligatorisches Feld</span>
                        {this.props.children}
                    </form>
                </Paper>
            </div>
        );
    }
}
