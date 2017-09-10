import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import InputComponent from '../components/InputComponent';

class RegistrationPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errors: {}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(theEvent) {
        this.setState({ [theEvent.target.name]: theEvent.target.value });
    }

    onSubmit(theEvent) {
        this.props.history.replace('/login');
    }

    render() {
        const { errors } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <InputComponent
                    error={errors.name}
                    label="Name"
                    onChange={this.onChange}
                    value={this.state.name}
                    field="name"
                />
                <InputComponent
                    error={errors.email}
                    label="E-Mail"
                    onChange={this.onChange}
                    value={this.state.email}
                    field="email"
                />
                <InputComponent
                    error={errors.password}
                    label="Passwort"
                    onChange={this.onChange}
                    value={this.state.password}
                    field="password"
                    type="password"
                />
                <InputComponent
                    error={errors.passwordConfirmation}
                    label="Passwort bestätigen"
                    onChange={this.onChange}
                    value={this.state.passwordConfirmation}
                    field="passwordConfirmation"
                    type="password"
                />
                <RaisedButton label="Registrieren" icon={<PersonAdd/>} onClick={this.onSubmit} primary/>
            </form>
        );
    }
}

RegistrationPage.propTypes = {
    history: PropTypes.object.isRequired
};

export default RegistrationPage;
