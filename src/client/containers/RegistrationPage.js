import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import axios from 'axios';

import InputComponent from '../components/InputComponent';

export default class RegistrationPage extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: {},
        loading: false
    };

    onChange = (theEvent) => {
        this.setState({ [theEvent.target.name]: theEvent.target.value });
    };

    onSubmit = (theEvent) => {
        this.setState({ loading: true });
        const { email, name, password, passwordConfirmation } = this.state;
        axios.post('/api/users', { credentials: { email, name, password, passwordConfirmation }})
            .then(response => {
                this.props.history.replace('/login');
            })
            .catch((err) => this.setState({
                errors: err.response.data.errors,
                loading: false
            }));
    };

    render() {
        const { errors, loading } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <InputComponent
                    error={errors.name}
                    label="Name"
                    onChange={this.onChange}
                    value={this.state.name}
                    field="name"
                    disabled={loading}
                />
                <InputComponent
                    error={errors.email}
                    label="E-Mail"
                    onChange={this.onChange}
                    value={this.state.email}
                    field="email"
                    disabled={loading}
                />
                <InputComponent
                    error={errors.password}
                    label="Passwort"
                    onChange={this.onChange}
                    value={this.state.password}
                    field="password"
                    type="password"
                    disabled={loading}
                />
                <InputComponent
                    error={errors.passwordConfirmation}
                    label="Passwort bestätigen"
                    onChange={this.onChange}
                    value={this.state.passwordConfirmation}
                    field="passwordConfirmation"
                    type="password"
                    disabled={loading}
                />
                <RaisedButton label="Registrieren" icon={<PersonAdd/>} onClick={this.onSubmit} disabled={loading} primary/>
            </form>
        );
    }
}
