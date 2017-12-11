import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import ApplicationBar from '../containers/ApplicationBar';
import RegistrationForm from '../components/RegistrationForm';

import { setLoading } from '../actions/application';
import { createUser } from '../actions/user';
import { isLoading } from '../selectors/application';

import registrationValidator from '../../shared/validations/registration';

import User from '../../shared/businessobjects/User';

import './RegistrationPage.css';

class RegistrationPage extends React.Component {

    static propTypes = {
        createUser: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        name: '',
        email: '',
        newPassword: '',
        passwordConfirmation: '',
        errors: {}
    };

    onChange = (theEvent) => {
        this.setState({ [theEvent.target.name]: theEvent.target.value });
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.props.setLoading(true);
        const { email, name, newPassword, passwordConfirmation } = this.state;
        const user = new User({ email, name, newPassword, passwordConfirmation });
        const validation = registrationValidator.validate(user);
        if (validation.isValid) {
            this.props.createUser(user)
                .then(() => {
                    this.props.setLoading(false);
                    this.props.history.replace('/');
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
        const { name, email, newPassword, passwordConfirmation, errors } = this.state;
        return (
            <div>
                <ApplicationBar/>
                <RegistrationForm
                    name={name}
                    email={email}
                    newPassword={newPassword}
                    passwordConfirmation={passwordConfirmation}
                    errors={errors}
                    loading={loading}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}>
                    <div className="registration-page__buttonbar">
                        <div className="registration-page__button">
                            <RaisedButton type="submit" label="Registrieren" icon={<PersonAdd/>} disabled={loading} primary/>
                        </div>
                    </div>
                </RegistrationForm>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { createUser, setLoading })(RegistrationPage);
