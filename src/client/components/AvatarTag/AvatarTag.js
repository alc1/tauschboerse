import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import './AvatarTag.css';

export default class AvatarTag extends React.Component {

    static propTypes = {
        text: PropTypes.string.isRequired,
        icon: PropTypes.object,
        backgroundColor: PropTypes.string,
        labelColor: PropTypes.string
    };

    render() {
        const { text, icon, backgroundColor, labelColor } = this.props;
        return (
            <div className="avatar-tag">
                <Chip style={{ border: `2px solid ${labelColor}` }} backgroundColor={backgroundColor} labelColor={labelColor} onClick={this.props.onClick}>
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
