import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';

import { login } from '../actions/user';
import InputComponent from '../components/InputComponent';

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
        const { errors, loading } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <InputComponent
                    error={errors.email}
                    label="E-Mail"
                    onChange={this.onChange}
                    value={this.state.email}
                    field="email"
                    disabled={loading}
                />
                <InputComponent
                    error={errors.password}
                    label="Passwort"
                    onChange={this.onChange}
                    value={this.state.password}
                    field="password"
                    type="password"
                    disabled={loading}
                />
                <RaisedButton label="Anmelden" icon={<LockOpen/>} onClick={this.onSubmit} disabled={loading} primary/>
            </form>
        );
    }
}

export default connect(null, { login })(LoginPage);
