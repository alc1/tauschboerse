import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

import AvatarTag from '../AvatarTag/AvatarTag';
import InputComponent from '../InputComponent/InputComponent';

import Gender from '../../../shared/constants/Gender';

import './UserDetailsBox.css';

const toolbarTitleStyle = { color: 'black' };

export default class UserDetailsBox extends React.Component {

    static propTypes = {
        userDetails: PropTypes.shape({
            gender: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired,
            registration: PropTypes.string.isRequired
        }).isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onGenderSelectionChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { userDetails, errors, loading, onChange, onGenderSelectionChange, onSubmit } = this.props;
        const { gender, name, email, address, registration } = userDetails;
        return (
            <section className="user-details">
                <Paper className="user-details__container">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Benutzerdetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="user-details__fields-container" onSubmit={onSubmit}>
                        <AvatarTag text={`Mitglied seit ${moment(registration).format('DD.MM.YYYY | HH:mm')}`} icon={<AccountCircle/>}/>
                        <SelectField
                            style={{ width: '90%' }}
                            errorText={errors.gender}
                            floatingLabelText="Anrede *"
                            onChange={onGenderSelectionChange}
                            value={gender}
                            name="gender"
                            disabled={loading}>
                            <MenuItem value={Gender.MALE} primaryText="Herr"/>
                            <MenuItem value={Gender.FEMALE} primaryText="Frau"/>
                        </SelectField>
                        <InputComponent
                            setElementRef={element => this.firstInputElement = element}
                            error={errors.name}
                            label="Name *"
                            onChange={onChange}
                            value={name}
                            field="name"
                            disabled={loading}/>
                        <InputComponent
                            error={errors.email}
                            label="E-Mail *"
                            onChange={onChange}
                            value={email}
                            field="email"
                            disabled={loading}/>
                        <InputComponent
                            error={errors.address}
                            label="Postadresse"
                            onChange={onChange}
                            value={address}
                            field="address"
                            multiLine={true}
                            disabled={loading}/>
                        <span className="user-details__hint">* Obligatorisches Feld</span>
                    </div>
                </Paper>
            </section>
        );
    }
}
