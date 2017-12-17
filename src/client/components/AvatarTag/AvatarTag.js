import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import './AvatarTag.css';

export default class AvatarTag extends React.Component {

    static propTypes = {
        text: PropTypes.string.isRequired,
        icon: PropTypes.object
    };

    render() {
        const { text, icon } = this.props;
        return (
            <div className="avatar-tag">
                <Chip>{icon ? <Avatar icon={icon}/> : <Avatar>{text.substr(0, 1)}</Avatar>}{text}</Chip>
            </div>
        );
    }
}
