import React from 'react';
import PropTypes from 'prop-types';

import muiThemeable from 'material-ui/styles/muiThemeable';

import './UserInfo.css';

class UserInfo extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        user: PropTypes.object
    };

    render() {
        const { width, height, user } = this.props;
        return (
            <div className="user-info__container">
                {user ? (
                    <svg fill={this.props.muiTheme.palette.primary1Color} height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                ) : (
                    <svg fill="#E1E1E1" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
                    </svg>
                )}
                <span className="user-info__text">{user ? user.name : 'Nicht angemeldet'}</span>
            </div>
        );
    }
}

export default muiThemeable()(UserInfo);
