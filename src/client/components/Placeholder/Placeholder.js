import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../images/Loading';
import Info from '../../images/Info';

import './Placeholder.css';

export default class Placeholder extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        loading: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
        loadingText: PropTypes.string.isRequired,
        muiTheme: PropTypes.shape({
            fontFamily: PropTypes.string.isRequired
        }).isRequired
    };

    render() {
        const { width, height, loading, text, loadingText } = this.props;
        const { fontFamily } = this.props.muiTheme;
        return (
            <div>
                {loading ? (
                    <div className="placeholder__container">
                        <Loading fill="#E1E1E1" width={width} height={height}/>
                        <span className="placeholder__text" style={{ fontFamily: fontFamily }}>{loadingText}</span>
                    </div>
                ) : (
                    <div className="placeholder__container">
                        <Info fill="#E1E1E1" width={width} height={height}/>
                        <span className="placeholder__text" style={{ fontFamily: fontFamily }}>{text}</span>
                    </div>
                )}
            </div>
        );
    }
}
