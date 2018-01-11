import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import PhotoAddIcon from 'material-ui/svg-icons/image/add-a-photo';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FavoriteSelectedIcon from 'material-ui/svg-icons/action/favorite';
import FavoriteUnselectedIcon from 'material-ui/svg-icons/action/favorite-border';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';

import { cyan500 } from 'material-ui/styles/colors';

import Photo from '../Photo/Photo';
import PhotoPlaceholder from '../PhotoPlaceholder/PhotoPlaceholder';

import './PhotosComponent.css';

const toolbarTitleStyles = { color: 'black' };
const overwritingMainPhotoBorder = `1px solid ${cyan500}`;
const overwritingImageBorderRadius = '10px';

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

    createPhotoWrapper = (thePhoto, thePhotoIndex, isDisplayMode) => {
        const { photos, loading, onRemovePhoto, onSelectMainPhoto } = this.props;
        const showDeletePhotoButton = !isDisplayMode && onRemovePhoto;
        const showMainPhotoCheckbox = !isDisplayMode && onSelectMainPhoto;
        return (
            <div className="photos-component__image-wrapper" key={thePhoto.fileName} style={{ border: thePhoto.isMain ? overwritingMainPhotoBorder : undefined }}>
                <Photo
                    imageClassName="photos-component__image"
                    imageStyle={{ borderRadius: isDisplayMode ? overwritingImageBorderRadius : undefined }}
                    photos={photos}
                    mainPhotoIndex={thePhotoIndex}/>
                {showDeletePhotoButton &&
                    <FlatButton
                        label="Entfernen"
                        icon={<DeleteIcon/>}
                        onClick={onRemovePhoto.bind(this, thePhoto)}
                        disabled={loading}
                        secondary/>
                }
                {showMainPhotoCheckbox &&
                    <FlatButton
                        label="Titelbild"
                        icon={thePhoto.isMain ? <FavoriteSelectedIcon/> : <FavoriteUnselectedIcon/>}
                        onClick={onSelectMainPhoto.bind(this, thePhoto)}
                        disabled={loading}
                        primary={thePhoto.isMain}/>
                }
            </div>
        );
    };

    render() {
        const { photos, loading, isDisplayMode } = this.props;
        const showAddPhotoButton = !isDisplayMode && this.props.onPhotoLoaded;
        const hasPhotos = photos && photos.length > 0;
        const photoWrappers = photos.map((photo, index) => this.createPhotoWrapper(photo, index, isDisplayMode));

        return (
            <div className="photos-component__container">
                <Paper className="photos-component__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyles} text="Bilder"/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            {showAddPhotoButton &&
                                <FlatButton
                                    label="Neue Bilder hinzufügen"
                                    icon={<PhotoAddIcon/>}
                                    onClick={this.onAddPhotoClicked}
                                    disabled={loading}
                                    primary/>
                            }
                            {showAddPhotoButton &&
                                <input
                                    className="photos-component__file-input"
                                    ref={element => this.fileInputElement = element}
                                    type="file"
                                    accept="image/*"
                                    multiple/>
                            }
                            {showAddPhotoButton &&
                                <IconButton
                                    iconStyle={{ color: cyan500 }}
                                    tooltip="Erlaubte Maximalgrösse eines Bildes: 10MB"
                                    touch={true}
                                    tooltipPosition="bottom-left">
                                    <HelpIcon/>
                                </IconButton>
                            }
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="photos-component__images-container">
                        {hasPhotos ? photoWrappers : <PhotoPlaceholder width={100} height={100}/>}
                    </div>
                </Paper>
            </div>
        );
    }
}
