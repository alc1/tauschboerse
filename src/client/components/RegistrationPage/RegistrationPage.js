import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import RegistrationIcon from 'material-ui/svg-icons/social/person-add';

import ApplicationBar from '../../containers/ApplicationBar';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import ContentContainer from '../ContentContainer/ContentContainer';

import { INFO_MESSAGE } from '../../model/GlobalMessageParams';

import registrationValidator from '../../../shared/validations/registration';
import Gender from '../../../shared/constants/Gender';

import './RegistrationPage.css';

export default class RegistrationPage extends React.Component {

    static propTypes = {
        createUser: PropTypes.func.isRequired,
        setGlobalMessage: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        gender: Gender.MALE,
        name: '',
        email: '',
        address: '',
        newPassword: '',
        passwordConfirmation: '',
        errors: {}
    };

    onChange = (theEvent) => {
        this.setState({ [theEvent.target.name]: theEvent.target.value });
    };

    onGenderSelectionChange = (theEvent, theKey, theValue) => {
        this.setState({ gender: theValue });
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        const { gender, email, name, address, newPassword, passwordConfirmation } = this.state;
        const user = { gender, email, name, address, newPassword, passwordConfirmation };
        const validation = registrationValidator.validate(user);
        if (validation.isValid) {
            this.props.createUser(user)
                .then(() => {
                    this.props.setGlobalMessage('Dein Konto wurde erstellt.', INFO_MESSAGE);
                    this.props.history.replace('/');
                })
                .catch((err) => {
                    this.setState({ errors: err.response.data.errors || {} })
                });
        }
        else {
            this.setState({ errors: validation.errors });
        }
    };

    render() {
        const { loading } = this.props;
        const { gender, name, email, address, newPassword, passwordConfirmation, errors } = this.state;
        return (
            <div>
                <ApplicationBar subtitle="Registrierung"/>
                <ContentContainer>
                    <RegistrationForm
                        gender={gender}
                        name={name}
                        email={email}
                        address={address}
                        newPassword={newPassword}
                        passwordConfirmation={passwordConfirmation}
                        errors={errors}
                        loading={loading}
                        onChange={this.onChange}
                        onGenderSelectionChange={this.onGenderSelectionChange}
                        onSubmit={this.onSubmit}>
                        <div className="registration-page__buttonbar">
                            <div className="registration-page__button">
                                <RaisedButton type="submit" label="Registrieren" icon={<RegistrationIcon/>} disabled={loading} primary/>
                            </div>
                        </div>
                    </RegistrationForm>
                </ContentContainer>
            </div>
        );
    }
}
