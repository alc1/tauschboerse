import React from 'react';
import PropTypes from 'prop-types';

import muiThemeable from 'material-ui/styles/muiThemeable';

import './ArticlePlaceholder.css';

class ArticlePlaceholder extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    };

    render() {
        const { width, height } = this.props;
        return (
            <div className="article-placeholder__container">
                <svg fill="#E1E1E1" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
                </svg>
                <span className="article-placeholder__text" style={{ fontFamily: this.props.muiTheme.fontFamily }}>Keine Artikel gefunden</span>
            </div>
        );
    }
}

export default muiThemeable()(ArticlePlaceholder);
