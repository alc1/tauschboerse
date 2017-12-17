import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import LoginIcon from 'material-ui/svg-icons/action/lock-open';
import RegistrationIcon from 'material-ui/svg-icons/social/person-add';

import ApplicationBar from '../containers/ApplicationBar';
import LoginForm from '../components/LoginForm';

import { setLoading } from '../store/actions/application';
import { login } from '../store/actions/user';
import { isLoading } from '../store/selectors/application';

import User from '../../shared/businessobjects/User';

import './LoginPage.css';

class LoginPage extends React.Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        email: '',
        currentPassword: '',
        errors: {}
    };

    goToRegistration = () => {
        this.props.history.push('/registration');
    };

    onChange = (theEvent) => {
        this.setState({ [theEvent.target.name]: theEvent.target.value });
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.props.setLoading(true);
        this.setState({ errors: {} });
        const { email, currentPassword } = this.state;
        const user = new User({ email, currentPassword });
        this.props.login(user)
            .then(() => {
                this.props.setLoading(false);
                const { from } = this.props.location.state || { from: { pathname: '/' } };
                this.props.history.replace(from);
            })
            .catch((err) => {
                this.props.setLoading(false);
                this.setState({ errors: err.response.data.errors || {} })
            });
    };

    render() {
        const { loading } = this.props;
        const { email, currentPassword, errors } = this.state;
        return (
            <div>
                <ApplicationBar/>
                <LoginForm
                    email={email}
                    currentPassword={currentPassword}
                    errors={errors}
                    loading={loading}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}>
                    <div className="login-page__buttonbar">
                        <div className="login-page__button">
                            <RaisedButton type="submit" label="Anmelden" icon={<LoginIcon/>} disabled={loading} primary/>
                        </div>
                        <div className="login-page__button">
                            <FlatButton label="Neues Konto erstellen" icon={<RegistrationIcon/>} disabled={loading} onClick={this.goToRegistration} secondary/>
                        </div>
                    </div>
                </LoginForm>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { login, setLoading })(LoginPage);
