import React from 'react';
import PropTypes from 'prop-types';

import Photo from '../_svg/Photo';

import './PhotoPlaceholder.css';

export default class PhotoPlaceholder extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        text: PropTypes.string
    };

    createComponentToRender = () => {
        const { width, height, text } = this.props;
        if (text) {
            return (
                <div className="photo-placeholder">
                    <Photo fill="#E1E1E1" width={width} height={height}/>
                    <span className="photo-placeholder__text">{text}</span>
                </div>
            );
        }
        else {
            return (
                <Photo fill="#E1E1E1" width={width} height={height} {...this.props}/>
            );
        }
    };

    render() {
        return this.createComponentToRender();
    }
}
