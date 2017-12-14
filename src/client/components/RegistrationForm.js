import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';

import InputComponent from '../components/InputComponent';

import './RegistrationForm.css';

export default class UserDetailsForm extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        newPassword: PropTypes.string.isRequired,
        passwordConfirmation: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { name, email, newPassword, passwordConfirmation, errors, loading, onChange, onSubmit } = this.props;
        return (
            <div className="registration-form__container">
                <Paper className="registration-form__paper">
                    <h1 className="registration-form__title">Bitte gib zur Registrierung deine Benutzerdaten ein:</h1>
                    <form className="registration-form__field-container" onSubmit={onSubmit}>
                        <InputComponent
                            inputRef={inputElement => this.firstInputElement = inputElement}
                            error={errors.name}
                            label="Name *"
                            onChange={onChange}
                            value={name}
                            field="name"
                            disabled={loading}/>
                        <InputComponent
                            error={errors.email}
                            label="E-Mail *"
                            onChange={onChange}
                            value={email}
                            field="email"
                            disabled={loading}/>
                        <InputComponent
                            error={errors.newPassword}
                            label="Passwort *"
                            onChange={onChange}
                            value={newPassword}
                            field="newPassword"
                            type="password"
                            disabled={loading}/>
                        <InputComponent
                            error={errors.passwordConfirmation}
                            label="Passwort bestätigen *"
                            onChange={onChange}
                            value={passwordConfirmation}
                            field="passwordConfirmation"
                            type="password"
                            disabled={loading}/>
                        <span className="registration-form__hint-text">* Obligatorisches Feld</span>
                        {this.props.children}
                    </form>
                </Paper>
            </div>
        );
    }
}
