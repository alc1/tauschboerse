import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import RegistrationForm from '../components/RegistrationForm';

import { createUser } from '../actions/user';

import registrationValidator from '../../shared/validations/registration';

class RegistrationPage extends React.Component {

    static propTypes = {
        createUser: PropTypes.func.isRequired,
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
            this.props.createUser(email, name, password, passwordConfirmation)
                .then(res => {
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
                <LoadingIndicatorComponent loading={loading}/>
                <RegistrationForm
                    name={name}
                    email={email}
                    password={password}
                    passwordConfirmation={passwordConfirmation}
                    errors={errors}
                    loading={loading}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}>
                    <RaisedButton type="submit" label="Registrieren" icon={<PersonAdd/>} disabled={loading} primary/>
                </RegistrationForm>
            </div>
        );
    }
}

export default connect(null, { createUser })(RegistrationPage);
