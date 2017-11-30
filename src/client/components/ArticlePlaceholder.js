import React from 'react';
import PropTypes from 'prop-types';

import muiThemeable from 'material-ui/styles/muiThemeable';

import './ArticlePlaceholder.css';

class ArticlePlaceholder extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        loading: PropTypes.bool.isRequired,
    };

    render() {
        const { width, height, loading } = this.props;
        return (
            <div>
                {loading ? (
                    <div className="article-placeholder__container">
                        <svg fill="#E1E1E1" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                        <span className="article-placeholder__text" style={{ fontFamily: this.props.muiTheme.fontFamily }}>... Artikel werden geladen ...</span>
                    </div>
                ) : (
                    <div className="article-placeholder__container">
                        <svg fill="#E1E1E1" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
                        </svg>
                        <span className="article-placeholder__text" style={{ fontFamily: this.props.muiTheme.fontFamily }}>Keine Artikel gefunden</span>
                    </div>
                )}
            </div>
        );
    }
}

export default muiThemeable()(ArticlePlaceholder);
