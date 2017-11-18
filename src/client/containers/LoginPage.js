import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import ApplicationBar from '../components/ApplicationBar';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import GlobalMessageComponent from '../components/GlobalMessageComponent';
import LoginForm from '../components/LoginForm';

import { login } from '../actions/user';

import User from '../../shared/businessobjects/User';

class LoginPage extends React.Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        email: '',
        currentPassword: '',
        errors: {},
        loading: false
    };

    onChange = (theEvent) => {
        this.setState({ [theEvent.target.name]: theEvent.target.value });
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.setState({
            errors: {},
            loading: true
        });
        const { email, currentPassword } = this.state;
        const user = new User({ email, currentPassword });
        this.props.login(user)
            .then(() => {
                const { from } = this.props.location.state || { from: { pathname: '/' } };
                this.props.history.replace(from);
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data.errors || {},
                    loading: false
                })
            });
    };

    render() {
        const { email, currentPassword, errors, loading } = this.state;
        return (
            <div>
                <ApplicationBar/>
                <LoadingIndicatorComponent loading={loading}/>
                <LoginForm
                    email={email}
                    currentPassword={currentPassword}
                    errors={errors}
                    loading={loading}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}>
                    <RaisedButton type="submit" label="Anmelden" icon={<LockOpen/>} disabled={loading} primary/>
                    <br/>
                    <Link to="/registration">
                        <FlatButton label="Neues Konto erstellen" icon={<PersonAdd/>} disabled={loading} secondary/>
                    </Link>
                </LoginForm>
                <GlobalMessageComponent/>
            </div>
        );
    }
}

export default connect(null, { login })(LoginPage);
