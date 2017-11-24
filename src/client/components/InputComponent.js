import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

const styles = { width: '90%' };

export default class InputComponent extends React.Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        multiLine: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool.isRequired,
        error: PropTypes.string
    };

    static defaultProps = {
        type: 'text',
        multiLine: false,
        disabled: false,
        errors: {}
    };

    render() {
        return (
            <TextField
                className="input-component"
                ref={this.props.inputRef}
                style={styles}
                hintText={this.props.label}
                floatingLabelText={this.props.label}
                errorText={this.props.error}
                onChange={this.props.onChange}
                value={this.props.value}
                type={this.props.type}
                multiLine={this.props.multiLine}
                name={this.props.field}
                disabled={this.props.disabled}
            />
        );
    }
}
