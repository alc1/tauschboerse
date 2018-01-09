import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import './AvatarTag.css';

export default class AvatarTag extends React.Component {

    static propTypes = {
        text: PropTypes.any.isRequired,
        withBorder: PropTypes.bool.isRequired,
        icon: PropTypes.object,
        backgroundColor: PropTypes.string,
        labelColor: PropTypes.string
    };

    static defaultProps = {
        withBorder: false
    };

    render() {
        const { text, withBorder, icon, backgroundColor, labelColor } = this.props;
        return (
            <div className="avatar-tag">
                <Chip style={withBorder ? { border: `2px solid ${labelColor}` } : null} backgroundColor={backgroundColor} labelColor={labelColor} onClick={this.props.onClick}>
                    {icon ? (
                        <Avatar backgroundColor={backgroundColor} color={labelColor} icon={icon}/>
                    ) : (
                        <Avatar>{text.substr(0, 1)}</Avatar>
                    )}
                    {text}
                </Chip>
            </div>
        );
    }
}
