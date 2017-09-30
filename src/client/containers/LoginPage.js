import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

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
        const inputStyles = { width: '350px' };
        const formStyles = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };
        return (
            <form style={formStyles} onSubmit={this.onSubmit}>
                {loading && <LinearProgress mode="indeterminate" color="#FF9800"/>}
                <InputComponent
                    style={inputStyles}
                    error={errors.email}
                    label="E-Mail"
                    onChange={this.onChange}
                    value={this.state.email}
                    field="email"
                    disabled={loading}
                />
                <InputComponent
                    style={inputStyles}
                    error={errors.password}
                    label="Passwort"
                    onChange={this.onChange}
                    value={this.state.password}
                    field="password"
                    type="password"
                    disabled={loading}
                />
                <br/>
                <RaisedButton label="Anmelden" icon={<LockOpen/>} onClick={this.onSubmit} disabled={loading} primary/>
                <br/>
                <Link to="/registration"><FlatButton label="Neues Konto erstellen" icon={<PersonAdd/>} disabled={loading} secondary/></Link>
            </form>
        );
    }
}

export default connect(null, { login })(LoginPage);
