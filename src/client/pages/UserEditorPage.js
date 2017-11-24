import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Save from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../components/ApplicationBar';
import UserDetailsForm from '../components/UserDetailsForm';
import UserPasswordForm from '../components/UserPasswordForm';

import { setGlobalMessage, setLoading, OK_MESSAGE } from '../actions/application';
import { updateUser } from '../actions/user';
import { isLoading } from '../selectors/application';
import { getUser } from '../selectors/user';

import { FLOATING_ACTION_BUTTON_POSITION_STYLE } from '../common';

import userDetailsValidator from '../../shared/validations/userDetails';

import User from '../../shared/businessobjects/User';

import './UserEditorPage.css';

class UserDetailsPage extends React.Component {

    static propTypes = {
        updateUser: PropTypes.func.isRequired,
        setGlobalMessage: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired
    };

    state = {
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: '',
        changePassword: false,
        errors: {},
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

    onPasswordChangeToggled = () => {
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
        this.props.setLoading(true);
        const { email, name, currentPassword, newPassword, passwordConfirmation } = this.state;
        const { _id, registration } = this.props.user;
        const user = new User({ email, name, registration, currentPassword, newPassword, passwordConfirmation });
        user._id = _id;
        const validation = userDetailsValidator.validate(user);
        if (validation.isValid) {
            this.props.updateUser(user)
                .then(() => {
                    this.props.setLoading(false);
                    if (this.state.changePassword) {
                        this.onPasswordChangeToggled();
                    }
                    this.setState({
                        errors: {},
                        modified: false
                    });
                    this.props.setGlobalMessage({
                        messageText: 'Benutzerdaten wurden gespeichert.',
                        messageType: OK_MESSAGE
                    });
                })
                .catch((err) => {
                    this.props.setLoading(false);
                    this.setState({ errors: err.response.data.errors || {} })
                });
        }
        else {
            this.props.setLoading(false);
            this.setState({ errors: validation.errors });
        }
    };

    render() {
        const { loading } = this.props;
        const { name, email, currentPassword, newPassword, passwordConfirmation, changePassword, errors, modified } = this.state;
        return (
            <div>
                <ApplicationBar/>
                <form className="user-editor__container" onSubmit={this.onSubmit}>
                    <UserDetailsForm
                        name={name}
                        email={email}
                        errors={errors}
                        loading={loading}
                        onChange={this.onChange}
                        onSubmit={this.onSubmit}/>
                    <UserPasswordForm
                        changePassword={changePassword}
                        currentPassword={currentPassword}
                        newPassword={newPassword}
                        passwordConfirmation={passwordConfirmation}
                        errors={errors}
                        loading={loading}
                        onChange={this.onChange}
                        onPasswordChangeChecked={this.onPasswordChangeToggled}
                        onSubmit={this.onSubmit}/>
                    <FloatingActionButton
                        style={FLOATING_ACTION_BUTTON_POSITION_STYLE}
                        type="submit"
                        disabled={loading || !modified}>
                        <Save/>
                    </FloatingActionButton>
                </form>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { updateUser, setGlobalMessage, setLoading })(UserDetailsPage);
