import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

import InputComponent from '../components/InputComponent';

import './UserDetailsForm.css';
import AvatarTag from "./AvatarTag";

const toolbarTitleStyle = { color: 'black' };

export default class UserDetailsForm extends React.Component {

    static propTypes = {
        userDetails: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            registration: PropTypes.string.isRequired
        }).isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { userDetails, errors, loading, onChange, onSubmit } = this.props;
        const { name, email, registration } = userDetails;
        return (
            <div className="user-details-form__container">
                <Paper className="user-details-form__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Benutzerdetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="user-details-form__field-container" onSubmit={onSubmit}>
                        <AvatarTag text={`Mitglied seit ${moment(registration).format('DD.MM.YYYY | HH:mm')}`} icon={<AccountCircle/>}/>
                        <InputComponent
                            inputRef={inputElement => this.firstInputElement = inputElement}
                            error={errors.name}
                            label="Name"
                            onChange={onChange}
                            value={name}
                            field="name"
                            disabled={loading}/>
                        <InputComponent
                            error={errors.email}
                            label="E-Mail"
                            onChange={onChange}
                            value={email}
                            field="email"
                            disabled={loading}/>
                    </div>
                </Paper>
            </div>
        );
    }
}
