import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

export default class PhotoLightbox extends React.Component {

    static propTypes = {
        isPhotoLightboxOpen: PropTypes.bool.isRequired,
        photoSources: PropTypes.array.isRequired,
        photoIndex: PropTypes.number.isRequired,
        onClosePhoto: PropTypes.func.isRequired,
        onMovePrevRequest: PropTypes.func.isRequired,
        onMoveNextRequest: PropTypes.func.isRequired
    };

    render() {
        const { isPhotoLightboxOpen, photoSources, photoIndex, onClosePhoto, onMovePrevRequest, onMoveNextRequest } = this.props;
        if (isPhotoLightboxOpen && photoSources.length > 0) {
            return (
                <Lightbox
                    mainSrc={photoSources[photoIndex]}
                    nextSrc={photoSources[(photoIndex + 1) % photoSources.length]}
                    prevSrc={photoSources[(photoIndex + photoSources.length - 1) % photoSources.length]}
                    onCloseRequest={onClosePhoto}
                    onMovePrevRequest={onMovePrevRequest}
                    onMoveNextRequest={onMoveNextRequest}
                />
            );
        }
        else {
            return null;
        }
    }
}
