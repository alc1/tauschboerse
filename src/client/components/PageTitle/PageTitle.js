import React from 'react';
import PropTypes from 'prop-types';

import './PageTitle.css';

export default class PageTitle extends React.Component {

    static propTypes = {
        muiTheme: PropTypes.shape({
            fontFamily: PropTypes.string.isRequired
        }).isRequired
    };

    render() {
        return (
            <h1 className="page-title" style={{ fontFamily: this.props.muiTheme.fontFamily }}>{this.props.children}</h1>
        );
    }
}
