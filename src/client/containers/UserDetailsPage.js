import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import Save from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../components/ApplicationBar';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import UserDetailsForm from '../components/UserDetailsForm';

import { updateUser } from '../actions/user';
import { getUser } from '../selectors/user';

import userDetailsValidator from '../../shared/validations/userDetails';

import User from '../../shared/businessobjects/User';

class UserDetailsPage extends React.Component {

    static propTypes = {
        updateUser: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    };

    state = {
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: '',
        changePassword: false,
        errors: {},
        loading: false,
        modified: false
    };

    componentDidMount() {
        const { name, email } = this.props.user;
        this.setState({ name, email });
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
            currentPassword: !newChangePasswordState ? '' : this.state.currentPassword,
            newPassword: !newChangePasswordState ? '' : this.state.newPassword,
            passwordConfirmation: !newChangePasswordState ? '' : this.state.passwordConfirmation,
            errors: {
                name: this.state.errors.name,
                email: this.state.errors.email,
                currentPassword: !newChangePasswordState ? undefined : this.state.errors.currentPassword,
                newPassword: !newChangePasswordState ? undefined : this.state.errors.newPassword,
                passwordConfirmation: !newChangePasswordState ? undefined : this.state.errors.passwordConfirmation,
            }
        });
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.setState({ loading: true });
        const { email, name, currentPassword, newPassword, passwordConfirmation } = this.state;
        const { _id, registration } = this.props.user;
        const user = new User({ email, name, registration, currentPassword, newPassword, passwordConfirmation });
        user._id = _id;
        const validation = userDetailsValidator.validate(user);
        if (validation.isValid) {
            this.props.updateUser(user)
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
        const { name, email, currentPassword, newPassword, passwordConfirmation, changePassword, errors, loading, modified } = this.state;
        return (
            <div>
                <ApplicationBar/>
                <LoadingIndicatorComponent loading={loading}/>
                <UserDetailsForm
                    name={name}
                    email={email}
                    changePassword={changePassword}
                    currentPassword={currentPassword}
                    newPassword={newPassword}
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

export default connect(mapStateToProps, { updateUser })(UserDetailsPage);
