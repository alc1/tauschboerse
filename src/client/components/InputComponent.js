import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

export default class InputComponent extends React.Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        error: PropTypes.string,
        type: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool.isRequired,
        checkUserExists: PropTypes.func
    };

    static defaultProps = {
        type: 'text',
        disabled: false
    };

    render() {
        return (
            <div>
                <TextField
                    hintText={this.props.label}
                    floatingLabelText={this.props.label}
                    errorText={this.props.error}
                    onChange={this.props.onChange}
                    onBlur={this.props.checkUserExists}
                    value={this.props.value}
                    type={this.props.type}
                    name={this.props.field}
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
}