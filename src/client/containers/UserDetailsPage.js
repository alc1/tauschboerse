import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from 'axios';
import jwt from 'jsonwebtoken';

import RaisedButton from 'material-ui/RaisedButton';
import Save from 'material-ui/svg-icons/content/save';

import UserDetailsForm from '../components/UserDetailsForm';

import store from '../store/store';
import { JWT_TOKEN_KEY } from '../common';
import { userLoggedIn } from '../actions/user';
import { getUser } from '../selectors/user';

import userDetailsValidator from '../../shared/validations/userDetails';
import LoadingIndicatorComponent from "../components/LoadingIndicatorComponent";

class UserDetailsPage extends React.Component {

    state = {
        name: '',
        email: '',
        oldPassword: '',
        password: '',
        passwordConfirmation: '',
        changePassword: false,
        errors: {},
        loading: false,
        modified: false
    };

    static propTypes = {
        user: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.setState({
            name: this.props.user.name,
            email: this.props.user.email
        });
    }

    onChange = (theEvent) => {
        this.setState({
            [theEvent.target.name]: theEvent.target.value,
            modified: true
        });
    };

    onPasswordChangeChecked = (theEvent) => {
        const newChangePasswordState = !this.state.changePassword;
        this.setState({
            changePassword: newChangePasswordState,
            oldPassword: !newChangePasswordState ? '' : this.state.oldPassword,
            password: !newChangePasswordState ? '' : this.state.password,
            passwordConfirmation: !newChangePasswordState ? '' : this.state.passwordConfirmation,
            errors: {
                name: this.state.errors.name,
                email: this.state.errors.email,
                oldPassword: !newChangePasswordState ? undefined : this.state.errors.oldPassword,
                password: !newChangePasswordState ? undefined : this.state.errors.password,
                passwordConfirmation: !newChangePasswordState ? undefined : this.state.errors.passwordConfirmation,
            }
        });
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.setState({ loading: true });
        const { email, name, oldPassword, password, passwordConfirmation } = this.state;
        const validation = userDetailsValidator.validate({ email, name, oldPassword, password, passwordConfirmation });
        if (validation.isValid) {
            axios.put(`/api/users/${this.props.user._id}`, { credentials: { email, name, oldPassword, password, passwordConfirmation } })
                .then(response => {
                    const token = response.data.token;
                    localStorage.setItem(JWT_TOKEN_KEY, token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const user = jwt.decode(token);
                    store.dispatch(userLoggedIn(user));
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
        const { name, email, oldPassword, password, passwordConfirmation, changePassword, errors, loading, modified } = this.state;
        return (
            <div>
                <LoadingIndicatorComponent loading={loading}/>
                <UserDetailsForm
                    name={name}
                    email={email}
                    changePassword={changePassword}
                    oldPassword={oldPassword}
                    password={password}
                    passwordConfirmation={passwordConfirmation}
                    errors={errors}
                    loading={loading}
                    onChange={this.onChange}
                    onPasswordChangeChecked={this.onPasswordChangeChecked}
                    onSubmit={this.onSubmit}>
                    <RaisedButton type="submit" label="Speichern" icon={<Save/>} disabled={loading || !modified} primary/>
                </UserDetailsForm>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState)
    };
}

export default connect(mapStateToProps)(UserDetailsPage);
