import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import LockOpen from 'material-ui/svg-icons/action/lock-open';

import * as Actions from '../actions/actions';
import InputComponent from '../components/InputComponent';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {},
            loading: false
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(theEvent) {
        this.setState({ [theEvent.target.name]: theEvent.target.value });
    }

    onSubmit(theEvent) {
        this.props.login(this.state.email, this.state.password).then(() => this.props.history.replace('/'));
    }

    render() {
        const { errors } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <InputComponent
                    error={errors.email}
                    label="E-Mail"
                    onChange={this.onChange}
                    value={this.state.email}
                    field="email"
                />
                <InputComponent
                    error={errors.password}
                    label="Passwort"
                    onChange={this.onChange}
                    value={this.state.password}
                    field="password"
                    type="password"
                />
                <RaisedButton label="Anmelden" icon={<LockOpen/>} onClick={this.onSubmit} primary/>
            </form>
        );
    }
}

LoginPage.propTypes = {
    login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginPage);
