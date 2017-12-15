import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import Delete from 'material-ui/svg-icons/action/delete';
import FavoriteSelected from 'material-ui/svg-icons/action/favorite';
import FavoriteUnselected from 'material-ui/svg-icons/action/favorite-border';

import PhotoPlaceholder from './PhotoPlaceholder';

import './PhotosComponent.css';

const toolbarTitleStyles = { color: 'black' };

export default class PhotosComponent extends React.Component {

    constructor(props) {
        super(props);
        this.acceptedFileTypes = ['image/gif', 'image/png', 'image/jpeg'];
    }

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        photos: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        onPhotoLoaded: PropTypes.func,
        onRemovePhoto: PropTypes.func,
        onSelectMainPhoto: PropTypes.func
    };

    static defaultProps = {
        photos: []
    };

    state = {
        isPhotoLightboxOpen: false,
        photoIndex: 0
    };

    componentDidMount() {
        if (!this.props.isDisplayMode && this.props.onPhotoLoaded) {
            this.fileInputElement.addEventListener('change', this.onInputChange);
        }
    }

    componentWillUnmount() {
        if (!this.props.isDisplayMode && this.props.onPhotoLoaded) {
            this.fileInputElement.removeEventListener('change', this.onInputChange);
        }
    }

    onInputChange = (theEvent) => {
        const fileArray = [...theEvent.target.files];
        fileArray
            .filter(file => this.acceptedFileTypes.includes(file.type))
            .forEach(file => {
                let reader = new FileReader();
                reader.onload = (event) => this.props.onPhotoLoaded(event, file);
                reader.readAsDataURL(file);
            });
        this.fileInputElement.value = null;
    };

    onAddPhotoClicked = () => {
        this.fileInputElement.click();
    };

    onOpenPhoto = (index) => {
        this.setState({
            isPhotoLightboxOpen: true,
            photoIndex: index
        });
    };

    onClosePhoto = () => {
        this.setState({ isPhotoLightboxOpen: false });
    };

    render() {
        const { photos, loading } = this.props;
        const { isPhotoLightboxOpen, photoIndex } = this.state;
        const hasPhotos = photos && photos.length > 0;

        const photoWrappers = photos.map((photo, index) =>
            <div className="photos-component__image-wrapper" key={photo.fileName}>
                <img
                    className="photos-component__image"
                    src={photo.isNew ? photo.fileContent : photo.url}
                    alt={photo.fileName}
                    onClick={this.onOpenPhoto.bind(this, index)}/>
                {!this.props.isDisplayMode && this.props.onRemovePhoto && <FlatButton label="Entfernen" icon={<Delete/>} onClick={this.props.onRemovePhoto.bind(this, photo)} disabled={loading} secondary/>}
                {!this.props.isDisplayMode && this.props.onSelectMainPhoto && <FlatButton label="Titelbild" icon={photo.isMain ? <FavoriteSelected/> : <FavoriteUnselected/>} onClick={this.props.onSelectMainPhoto.bind(this, photo)} disabled={loading} primary={photo.isMain}/>}
            </div>
        );
        const lightboxImages = photos.map((photo) => photo.isNew ? photo.fileContent : photo.url);

        return (
            <div className="photos-component__container">
                <Paper className="photos-component__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyles} text="Bilder"/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            {!this.props.isDisplayMode && this.props.onPhotoLoaded && <FlatButton label="Neue Bilder hinzufügen" icon={<AddAPhoto/>} onClick={this.onAddPhotoClicked} disabled={loading} primary/>}
                            <input className="photos-component__file-input" type="file" ref={element => this.fileInputElement = element} accept="image/*" multiple/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="photos-component__images-container">
                        {hasPhotos ? photoWrappers : <PhotoPlaceholder width={100} height={100}/>}
                    </div>
                    {isPhotoLightboxOpen && lightboxImages.length > 0 &&
                        <Lightbox
                            mainSrc={lightboxImages[photoIndex]}
                            nextSrc={lightboxImages[(photoIndex + 1) % lightboxImages.length]}
                            prevSrc={lightboxImages[(photoIndex + lightboxImages.length - 1) % lightboxImages.length]}
                            onCloseRequest={this.onClosePhoto}
                            onMovePrevRequest={() => this.setState({
                                photoIndex: (photoIndex + lightboxImages.length - 1) % lightboxImages.length,
                            })}
                            onMoveNextRequest={() => this.setState({
                                photoIndex: (photoIndex + 1) % lightboxImages.length,
                            })}
                        />
                    }
                </Paper>
            </div>
        );
    }
}
