import React from 'react';
import PropTypes from 'prop-types';

import muiThemeable from 'material-ui/styles/muiThemeable';

import Account from '../images/Account';
import Info from '../images/Info';

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
                    <Account fill={this.props.muiTheme.palette.primary1Color} width={width} height={height}/>
                ) : (
                    <Info fill="#E1E1E1" width={width} height={height}/>
                )}
                <span className="user-info__text">{user ? user.name : 'Nicht angemeldet'}</span>
            </div>
        );
    }
}

export default muiThemeable()(UserInfo);
