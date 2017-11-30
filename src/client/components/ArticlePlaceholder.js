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
                            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
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
