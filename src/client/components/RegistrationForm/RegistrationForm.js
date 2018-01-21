import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import InputComponent from '../InputComponent/InputComponent';

import Gender from '../../../shared/constants/Gender';

import './RegistrationForm.css';

export default class RegistrationForm extends React.Component {

    static propTypes = {
        gender: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        newPassword: PropTypes.string.isRequired,
        passwordConfirmation: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onGenderSelectionChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { gender, name, email, address, newPassword, passwordConfirmation, errors, loading, onChange, onGenderSelectionChange, onSubmit } = this.props;
        return (
            <section className="registration-form">
                <Paper className="registration-form__container">
                    <h1 className="registration-form__title">Bitte gib zur Registrierung deine Benutzerdaten ein:</h1>
                    <form className="registration-form__field-container" onSubmit={onSubmit}>
                        <SelectField
                            style={{ width: '90%' }}
                            errorText={errors.gender}
                            floatingLabelText="Anrede *"
                            onChange={onGenderSelectionChange}
                            value={gender}
                            name="gender"
                            disabled={loading}>
                            <MenuItem value={Gender.MALE} primaryText="Herr"/>
                            <MenuItem value={Gender.FEMALE} primaryText="Frau"/>
                        </SelectField>
                        <InputComponent
                            setElementRef={element => this.firstInputElement = element}
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
                            error={errors.address}
                            label="Postadresse"
                            onChange={onChange}
                            value={address}
                            field="address"
                            multiLine={true}
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
            </section>
        );
    }
}
