import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../_svg/Loading';
import Info from '../_svg/Info';

import './Placeholder.css';

export default class Placeholder extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        isVertical: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
        loadingText: PropTypes.string.isRequired,
        muiTheme: PropTypes.shape({
            fontFamily: PropTypes.string.isRequired
        }).isRequired
    };

    static defaultProps = {
        loading: false,
        loadingText: '',
        isVertical: true
    };

    render() {
        const { width, height, loading, text, loadingText, isVertical } = this.props;
        const { fontFamily } = this.props.muiTheme;
        return (
            <div>
                {loading ? (
                    <div className={`placeholder ${isVertical ? 'placeholder--vertical' : 'placeholder--horizontal'}`}>
                        <Loading fill="#E1E1E1" width={width} height={height}/>
                        <span className="placeholder__text" style={{ fontFamily: fontFamily }}>{loadingText}</span>
                    </div>
                ) : (
                    <div className={`placeholder ${isVertical ? 'placeholder--vertical' : 'placeholder--horizontal'}`}>
                        <Info fill="#E1E1E1" width={width} height={height}/>
                        <span className="placeholder__text" style={{ fontFamily: fontFamily }}>{text}</span>
                    </div>
                )}
            </div>
        );
    }
}
