import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Upload from 'material-ui-upload/Upload';

import NoPicture from '../images/NoPicture.png';

export default class PhotosComponent extends React.Component {

    static propTypes = {
        photos: PropTypes.array.isRequired,
        onPhotoLoaded: PropTypes.func.isRequired,
        onAddPhoto: PropTypes.func.isRequired,
        onRemovePhoto: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired
    };

    static defaultProps = {
        photos: []
    };

    render() {
        const { photos, loading } = this.props;
        const photoComponents = photos.map((photo, index) =>
            <CardMedia key={index}>
                <img src={photo.isNew ? photo.fileContent : photo.url} alt=""/>
                <CardActions>
                    <FlatButton label="Bild entfernen" onClick={this.props.onRemovePhoto.bind(this, photo)} disabled={loading} secondary/>
                </CardActions>
            </CardMedia>
        );
        return (
            <Card>
                <CardHeader title="Bilder"/>
                {photoComponents}
                <CardActions>
                    <Upload label="Neues Bild" onFileLoad={this.props.onPhotoLoaded} disabled={loading} primary/>
                    <FlatButton label="Neues Bild" onClick={this.props.onAddPhoto} disabled={loading} primary/>
                </CardActions>
            </Card>
        );
    }
}
