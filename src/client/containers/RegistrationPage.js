import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import ApplicationBar from '../components/ApplicationBar';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import GlobalMessageComponent from '../components/GlobalMessageComponent';
import RegistrationForm from '../components/RegistrationForm';

import { createUser } from '../actions/user';

import registrationValidator from '../../shared/validations/registration';

import User from '../../shared/businessobjects/User';

class RegistrationPage extends React.Component {

    static propTypes = {
        createUser: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        name: '',
        email: '',
        newPassword: '',
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
        const { email, name, newPassword, passwordConfirmation } = this.state;
        const user = new User({ email, name, newPassword, passwordConfirmation });
        const validation = registrationValidator.validate(user);
        if (validation.isValid) {
            this.props.createUser(user)
                .then(res => {
                    this.props.history.replace('/');
                })
                .catch((err) => {
                    this.setState({
                        errors: err.response.data.errors || {},
                        loading: false
                    })
                });
        }
        else {
            this.setState({
                errors: validation.errors,
                loading: false
            });
        }
    };

    render() {
        const { name, email, newPassword, passwordConfirmation, errors, loading } = this.state;
        return (
            <div>
                <ApplicationBar/>
                <LoadingIndicatorComponent loading={loading}/>
                <RegistrationForm
                    name={name}
                    email={email}
                    newPassword={newPassword}
                    passwordConfirmation={passwordConfirmation}
                    errors={errors}
                    loading={loading}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}>
                    <RaisedButton type="submit" label="Registrieren" icon={<PersonAdd/>} disabled={loading} primary/>
                </RegistrationForm>
                <GlobalMessageComponent/>
            </div>
        );
    }
}

export default connect(null, { createUser })(RegistrationPage);
