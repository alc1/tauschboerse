import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

const styles = { width: '90%' };
const displayInputStyles = { color: 'black' };

export default class InputComponent extends React.Component {

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        field: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        multiLine: PropTypes.bool,
        onChange: PropTypes.func,
        error: PropTypes.string
    };

    static defaultProps = {
        isDisplayMode: false,
        type: 'text',
        disabled: false,
        multiLine: false,
        errors: {}
    };

    render() {
        const { isDisplayMode, inputRef, label, error, onChange, value, type, multiLine, field, disabled } = this.props;
        if (isDisplayMode) {
            styles.color = 'black';
        }
        return (
            <TextField
                className="input-component"
                style={styles}
                inputStyle={isDisplayMode ? displayInputStyles : undefined}
                textareaStyle={isDisplayMode ? displayInputStyles : undefined}
                ref={inputRef}
                hintText={label}
                floatingLabelText={label}
                errorText={error}
                onChange={onChange}
                value={value}
                type={type}
                multiLine={multiLine}
                name={field}
                disabled={isDisplayMode || disabled}
            />
        );
    }
}
