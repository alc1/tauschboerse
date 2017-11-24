import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import InputComponent from '../components/InputComponent';

import './UserDetailsForm.css';

const toolbarTitleStyle = { color: 'black' };

export default class UserDetailsForm extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { name, email, errors, loading, onChange, onSubmit } = this.props;
        return (
            <div className="user-details-form__container">
                <Paper className="user-details-form__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Benutzerdetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="user-details-form__field-container" onSubmit={onSubmit}>
                        <InputComponent
                            inputRef={inputElement => this.firstInputElement = inputElement}
                            error={errors.name}
                            label="Name"
                            onChange={onChange}
                            value={name}
                            field="name"
                            disabled={loading}
                        />
                        <InputComponent
                            error={errors.email}
                            label="E-Mail"
                            onChange={onChange}
                            value={email}
                            field="email"
                            disabled={loading}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}
