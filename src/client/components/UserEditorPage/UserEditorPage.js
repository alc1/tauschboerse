import React from 'react';
import PropTypes from 'prop-types';

import SaveIcon from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../../containers/ApplicationBar';
import UserDetailsForm from '../UserDetailsForm/UserDetailsForm';
import UserPasswordForm from '../UserPasswordForm/UserPasswordForm';
import PageButton from '../PageButton/PageButton';

import { OK_MESSAGE } from '../../store/actions/application';

import userDetailsValidator from '../../../shared/validations/userDetails';

import './UserEditorPage.css';

export default class UserDetailsPage extends React.Component {

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
        const user = { email, name, registration, currentPassword, newPassword, passwordConfirmation };
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
        const { loading, user } = this.props;
        const { name, email, currentPassword, newPassword, passwordConfirmation, changePassword, errors, modified } = this.state;
        const { registration } = user;
        const userDetails = { name, email, registration, changePassword, currentPassword, newPassword, passwordConfirmation };
        return (
            <div>
                <ApplicationBar subtitle="Mein Konto verwalten"/>
                <form className="user-editor__container" onSubmit={this.onSubmit}>
                    <UserDetailsForm
                        userDetails={userDetails}
                        errors={errors}
                        loading={loading}
                        onChange={this.onChange}
                        onSubmit={this.onSubmit}/>
                    <UserPasswordForm
                        userDetails={userDetails}
                        errors={errors}
                        loading={loading}
                        onChange={this.onChange}
                        onPasswordChangeChecked={this.onPasswordChangeToggled}
                        onSubmit={this.onSubmit}/>
                    <PageButton isSubmit={true} disabled={loading || !modified}>
                        <SaveIcon/>
                    </PageButton>
                </form>
            </div>
        );
    }
}
