import React from 'react';
import PropTypes from 'prop-types';

import Photo from '../_svg/Photo';

export default class PhotoPlaceholder extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    };

    render() {
        const { width, height } = this.props;
        return (
            <Photo fill="#E1E1E1" width={width} height={height}/>
        );
    }
}
