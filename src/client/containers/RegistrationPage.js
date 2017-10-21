import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import jwt from 'jsonwebtoken';

import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import UserDetailsForm from '../components/UserDetailsForm';

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
        theEvent.preventDefault();
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
        const { name, email, password, passwordConfirmation, errors, loading } = this.state;
        return (
            <div>
                {loading && <LinearProgress mode="indeterminate" color="#FF9800"/>}
                <UserDetailsForm
                    name={name}
                    email={email}
                    password={password}
                    passwordConfirmation={passwordConfirmation}
                    errors={errors}
                    loading={loading}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}>
                    <RaisedButton type="submit" label="Registrieren" icon={<PersonAdd/>} disabled={loading} primary/>
                </UserDetailsForm>
            </div>
        );
    }
}
