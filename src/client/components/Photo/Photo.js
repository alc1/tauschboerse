import React from 'react';
import PropTypes from 'prop-types';

import PhotoLightbox from '../PhotoLightbox/PhotoLightbox';

export default class Photo extends React.Component {

    static propTypes = {
        photos: PropTypes.array.isRequired,
        mainPhotoIndex: PropTypes.number.isRequired,
        imageClassName: PropTypes.string.isRequired,
        imageStyle: PropTypes.object
    };

    state = {
        isPhotoLightboxOpen: false,
        photoLightboxIndex: 0
    };

    onOpenPhoto = (thePhotoIndex) => {
        this.setState({
            isPhotoLightboxOpen: true,
            photoLightboxIndex: thePhotoIndex
        });
    };

    onClosePhoto = () => {
        this.setState({
            isPhotoLightboxOpen: false
        });
    };

    render() {
        const { photos, mainPhotoIndex, imageClassName, imageStyle } = this.props;
        const { isPhotoLightboxOpen, photoLightboxIndex } = this.state;
        const photo = photos[mainPhotoIndex];
        const photoSources = photos.map(photo => photo.isNew ? photo.fileContent : photo.url);
        return (
            <div>
                <img
                    className={imageClassName}
                    style={imageStyle}
                    src={photo.isNew ? photo.fileContent : photo.url}
                    alt={photo.title ? photo.title : photo.fileName}
                    onClick={this.onOpenPhoto.bind(this, mainPhotoIndex)}/>
                <PhotoLightbox
                    isPhotoLightboxOpen={isPhotoLightboxOpen}
                    photoSources={photoSources}
                    photoIndex={photoLightboxIndex}
                    onClosePhoto={this.onClosePhoto}
                    onMovePrevRequest={() => this.setState({
                        photoLightboxIndex: (photoLightboxIndex + photos.length - 1) % photos.length,
                    })}
                    onMoveNextRequest={() => this.setState({
                        photoLightboxIndex: (photoLightboxIndex + 1) % photos.length,
                    })}/>
            </div>
        );
    }
}
