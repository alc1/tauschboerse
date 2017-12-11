import React from 'react';
import PropTypes from 'prop-types';

import muiThemeable from 'material-ui/styles/muiThemeable';

import Loading from '../images/Loading';
import Info from '../images/Info';

import './ArticlePlaceholder.css';

class ArticlePlaceholder extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        loading: PropTypes.bool.isRequired,
    };

    render() {
        const { width, height, loading } = this.props;
        const { fontFamily } = this.props.muiTheme;
        return (
            <div>
                {loading ? (
                    <div className="article-placeholder__container">
                        <Loading fill="#E1E1E1" width={width} height={height}/>
                        <span className="article-placeholder__text" style={{ fontFamily: fontFamily }}>... Artikel werden geladen ...</span>
                    </div>
                ) : (
                    <div className="article-placeholder__container">
                        <Info fill="#E1E1E1" width={width} height={height}/>
                        <span className="article-placeholder__text" style={{ fontFamily: fontFamily }}>Keine Artikel gefunden</span>
                    </div>
                )}
            </div>
        );
    }
}

export default muiThemeable()(ArticlePlaceholder);
