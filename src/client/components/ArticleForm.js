import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from '../components/InputComponent';
import CategoryInputFieldContainer from '../containers/CategoryInputContainer';
import PhotosComponent from './PhotosComponent';

export default class ArticleForm extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        categories: PropTypes.array.isRequired,
        photos: PropTypes.array.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onAddCategory: PropTypes.func.isRequired,
        onRemoveCategory: PropTypes.func.isRequired,
        onPhotoLoaded: PropTypes.func.isRequired,
        onRemovePhoto: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.firstInputElement.focus();
    }

    render() {
        const { title, description, categories, photos, errors, loading, onChange, onSubmit, onAddCategory, onRemoveCategory, onPhotoLoaded, onRemovePhoto } = this.props;
        const inputStyles = { width: '350px' };
        const formStyles = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };
        return (
            <form style={formStyles} onSubmit={onSubmit}>
                <InputComponent
                    inputRef={inputElement => this.firstInputElement = inputElement}
                    style={inputStyles}
                    error={errors.title}
                    label="Titel"
                    onChange={onChange}
                    value={title}
                    field="title"
                    disabled={loading}
                />
                <InputComponent
                    style={inputStyles}
                    error={errors.description}
                    label="Beschreibung"
                    onChange={onChange}
                    value={description}
                    field="description"
                    multiLine={true}
                    disabled={loading}
                />
                <CategoryInputFieldContainer
                    style={inputStyles}
                    categories={categories}
                    errors={errors}
                    loading={loading}
                    onAddCategory={onAddCategory}
                    onRemoveCategory={onRemoveCategory}
                    allowNewValues={true}
                />
                <PhotosComponent
                    photos={photos}
                    onPhotoLoaded={onPhotoLoaded}
                    onRemovePhoto={onRemovePhoto}
                    loading={loading}
                />
                <br/>
                {this.props.children}
            </form>
        );
    }
}
