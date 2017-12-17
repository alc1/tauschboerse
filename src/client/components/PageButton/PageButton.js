import React from 'react';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';

const floatingActionButtonPositionStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed'
};

export default class PageButton extends React.Component {

    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        onClick: PropTypes.func,
        isSubmit: PropTypes.bool
    };

    static defaultProps = {
        disabled: false
    };

    render() {
        const { disabled, isSubmit, onClick } = this.props;
        let additionalProps = isSubmit ? { type: "submit" } : { onClick: onClick };
        return (
            <FloatingActionButton
                style={floatingActionButtonPositionStyle}
                disabled={disabled}
                {...additionalProps}>
                {this.props.children}
            </FloatingActionButton>
        );
    }
}
