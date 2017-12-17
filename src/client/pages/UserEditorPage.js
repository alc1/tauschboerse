import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Save from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../containers/ApplicationBar';
import UserDetailsForm from '../components/UserDetailsForm/UserDetailsForm';
import UserPasswordForm from '../components/UserPasswordForm/UserPasswordForm';
import PageButton from '../components/PageButton/PageButton';

import { setGlobalMessage, setLoading, OK_MESSAGE } from '../store/actions/application';
import { updateUser } from '../store/actions/user';
import { isLoading } from '../store/selectors/application';
import { getUser } from '../store/selectors/user';

import userDetailsValidator from '../../shared/validations/userDetails';

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
                <ApplicationBar/>
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
                        <Save/>
                    </PageButton>
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
