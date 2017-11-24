import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import Delete from 'material-ui/svg-icons/action/delete';

import './PhotosComponent.css';

const toolbarTitleStyles = { color: 'black' };

export default class PhotosComponent extends React.Component {

    constructor(props) {
        super(props);
        this.acceptedFileTypes = ['image/gif', 'image/png', 'image/jpeg'];
    }

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

    render() {
        const { photos, loading } = this.props;
        const photoComponents = photos.map((photo) =>
            <div key={photo.fileName}>
                <img src={photo.isNew ? photo.fileContent : photo.url} alt={photo.fileName}/>
                <FlatButton label="Bild entfernen" icon={<Delete/>} onClick={this.props.onRemovePhoto.bind(this, photo)} disabled={loading} secondary/>
            </div>
        );
        return (
            <div className="photos-component__container">
                <Paper className="photos-component__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyles} text="Bilder"/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarSeparator/>
                            <FlatButton label="Neue Bilder hinzufügen" icon={<AddAPhoto/>} onClick={this.onAddPhotoClicked} disabled={loading} primary/>
                            <input className="photos-component__file-input" type="file" ref={element => this.fileInputElement = element} accept="image/*" multiple/>
                        </ToolbarGroup>
                    </Toolbar>
                    {photoComponents}
                </Paper>
            </div>
        );
    }
}
