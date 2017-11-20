import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardMedia, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import Delete from 'material-ui/svg-icons/action/delete';

export default class PhotosComponent extends React.Component {

    static propTypes = {
        photos: PropTypes.array.isRequired,
        onPhotoLoaded: PropTypes.func.isRequired,
        onRemovePhoto: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired
    };

    static defaultProps = {
        photos: []
    };

    componentDidMount() {
        this.fileInputElement.addEventListener('change', this.onInputChange);
    }

    componentWillUnmount() {
        this.fileInputElement.removeEventListener('change', this.onInputChange);
    }

    onInputChange = (theEvent) => {
        const fileArray = [...theEvent.target.files];
        fileArray.forEach(file => {
            let reader = new FileReader();
            reader.onload = (event) => this.props.onPhotoLoaded(event, file);
            reader.readAsDataURL(file);
        });
    };

    onAddPhotoClicked = () => {
        this.fileInputElement.click();
    };

    render() {
        const { photos, loading } = this.props;
        const photoComponents = photos.map((photo) =>
            <CardMedia key={photo.fileName}>
                <img src={photo.isNew ? photo.fileContent : photo.url} alt=""/>
                <CardActions>
                    <FlatButton label="Bild entfernen" icon={<Delete/>} onClick={this.props.onRemovePhoto.bind(this, photo)} disabled={loading} secondary/>
                </CardActions>
            </CardMedia>
        );
        return (
            <Card>
                <CardHeader title="Bilder"/>
                {photoComponents}
                <CardActions>
                    <input type="file" ref={element => this.fileInputElement = element} style={{ display: 'none' }} />
                    <FlatButton label="Neues Bild hinzufügen" icon={<AddAPhoto/>} onClick={this.onAddPhotoClicked} disabled={loading} primary/>
                </CardActions>
            </Card>
        );
    }
}
