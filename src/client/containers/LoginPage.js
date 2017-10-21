import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

import { login } from '../actions/user';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import LoginForm from '../components/LoginForm';

class LoginPage extends React.Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        email: '',
        password: '',
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
        this.props.login(this.state.email, this.state.password)
            .then((res) => {
                const { from } = this.props.location.state || { from: { pathname: '/' } };
                this.props.history.replace(from);
            })
            .catch((err) => this.setState({
                errors: err.response.data.errors,
                loading: false
            }));
    };

    render() {
        const { email, password, errors, loading } = this.state;
        return (
            <div>
                <LoadingIndicatorComponent loading={loading}/>
                <LoginForm
                    email={email}
                    password={password}
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
            </div>
        );
    }
}

export default connect(null, { login })(LoginPage);
