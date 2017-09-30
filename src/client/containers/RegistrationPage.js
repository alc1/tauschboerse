import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import jwt from 'jsonwebtoken';

import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import InputComponent from '../components/InputComponent';

import store from '../store/store';
import { JWT_TOKEN_KEY } from '../common';
import { userLoggedIn } from '../actions/user';

import registrationValidator from '../../shared/validations/registration';

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
        const validation = registrationValidator.validate({ email, name, password, passwordConfirmation });
        if (validation.isValid) {
            axios.post('/api/users', { credentials: { email, name, password, passwordConfirmation } })
                .then(response => {
                    const token = response.data.token;
                    localStorage.setItem(JWT_TOKEN_KEY, token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const user = jwt.decode(token);
                    store.dispatch(userLoggedIn(user));
                    this.props.history.replace('/');
                })
                .catch((err) => this.setState({
                    errors: err.response.data.errors,
                    loading: false
                }));
        }
        else {
            this.setState({
                errors: validation.errors,
                loading: false
            });
        }
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
