import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import SaveIcon from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../../containers/ApplicationBar';
import Placeholder from '../../containers/Placeholder';
import ArticleDetails from '../ArticleDetails/ArticleDetails';
import PhotosComponent from '../PhotosComponent/PhotosComponent';
import PageButton from '../PageButton/PageButton';
import ContentContainer from '../ContentContainer/ContentContainer';

import articleDetailsValidator from '../../../shared/validations/articleDetails';

import './ArticleFormPage.css';

export default class ArticleFormPage extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        user: PropTypes.object,
        loading: PropTypes.bool.isRequired,
        loadArticle: PropTypes.func.isRequired,
        createArticle: PropTypes.func.isRequired,
        updateArticle: PropTypes.func.isRequired,
        removeSelectedArticle: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        title: '',
        description: '',
        categories: [],
        photos: [],
        status: null,
        created: null,
        owner: null,
        trades: null,
        errors: {},
        modified: false,
        articleFound: true,
        addedPhotos: [],
        removedPhotos: []
    };

    componentDidMount() {
        const { articleId } = this.props.match.params;
        if (articleId) {
            this.props.loadArticle(articleId)
                .then(() => {
                    this.resetArticleInState(this.props.article);
                })
                .catch(() => {
                    this.setState({ articleFound: false });
                });
        }
    }

    componentWillUnmount() {
        this.props.removeSelectedArticle();
    }

    resetArticleInState = (theArticle) => {
        const { title, description, categories, photos, status, created, owner, trades } = this.state;
        this.setState({
            title: theArticle ? theArticle.title : title,
            description: theArticle ? theArticle.description : description,
            categories: theArticle ? theArticle.categories : categories,
            photos: theArticle ? theArticle.photos : photos,
            status: theArticle ? theArticle.status : status,
            created: theArticle ? theArticle.created : created,
            owner: theArticle ? theArticle.owner : owner,
            trades: theArticle ? theArticle.trades : trades,
            errors: {},
            modified: false,
            addedPhotos: [],
            removedPhotos: []
        });
    };

    onChange = (theEvent) => {
        this.setState({
            [theEvent.target.name]: theEvent.target.value,
            modified: true
        });
    };

    onAddCategory = (theCategory) => {
        let newCategories = [...this.state.categories, theCategory];
        this.setState({
            categories: newCategories,
            modified: true
        });
    };

    onRemoveCategory = (theCategoryName) => {
        this.setState({
            categories: this.state.categories.filter(category => category.name !== theCategoryName),
            modified: true
        });
    };

    onPhotoLoaded = (theEvent, theFile) => {
        const newPhoto = {
            id: uuid.v1(),
            fileName: theFile.name,
            fileContent: theEvent.target.result,
            isNew: true,
            isMain: this.state.photos.length - this.state.removedPhotos.length + this.state.addedPhotos.length === 0
        };
        this.setState({
            addedPhotos: [...this.state.addedPhotos, newPhoto],
            modified: true
        });
    };

    onRemovePhoto = (thePhotoToRemove) => {
        // If the photo to remove is a new photo (not yet persisted), it should be removed from the list of added photos
        if (this.isNewPhoto(thePhotoToRemove)) {
            this.setState({
                addedPhotos: this.state.addedPhotos.filter((photo) => photo !== thePhotoToRemove),
                modified: true
            });
        }
        // Otherwise it is a persisted photo, therefore add it to the list of the removed photos
        else {
            this.setState({
                removedPhotos: [...this.state.removedPhotos, thePhotoToRemove],
                modified: true
            });
        }
    };

    onSelectMainPhoto = (theMainPhoto) => {
        // If the new main photo is a new photo (not yet persisted), mark it as main photo in the list of added photos
        // and remove all main photo states from the persisted photos (to be sure that there is only one main photo)
        if (this.isNewPhoto(theMainPhoto)) {
            this.setState({
                addedPhotos: this.state.addedPhotos.map(photo => {
                    return { ...photo, isMain: photo === theMainPhoto };
                }),
                photos: this.state.photos.map(photo => {
                    photo.isMain = false;
                    return photo;
                }),
                modified: true
            });
        }
        // Otherwise it is a persisted photo, therefore mark it as main photo in the list of the persisted photos and
        // remove all main photo states in the list of added photos (to be sure that there is only one main photo)
        else {
            this.setState({
                photos: this.state.photos.map(photo => {
                    photo.isMain = photo === theMainPhoto;
                    return photo;
                }),
                addedPhotos: this.state.addedPhotos.map(photo => {
                    photo.isMain = false;
                    return photo;
                }),
                modified: true
            });
        }
    };

    isNewPhoto = (thePhoto) => {
        return this.state.addedPhotos.some(photo => photo === thePhoto);
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        const { user } = this.props;
        const { title, description, categories, photos, status, created, addedPhotos, removedPhotos } = this.state;
        const { articleId } = this.props.match.params;
        let articleToSave = { title, description, categories, photos };
        const validation = articleDetailsValidator.validate(articleToSave);
        if (validation.isValid) {
            let articleSaveRequest;
            if (articleId) {
                articleToSave._id = articleId;
                articleToSave.status = status;
                articleToSave.created = created;
                articleSaveRequest = this.props.updateArticle(user._id, articleToSave, addedPhotos, removedPhotos)
                    .then(response => {
                        this.resetArticleInState(response.article);
                    });
            }
            else {
                articleSaveRequest = this.props.createArticle(articleToSave, addedPhotos)
                    .then(response => {
                        this.props.history.replace(`/article/${response.article._id}`);
                    });
            }
            articleSaveRequest.catch((err) => {
                this.setState({ errors: err.response || err.response.data || err.response.data.errors || {} });
            });
        }
        else {
            this.setState({ errors: validation.errors });
        }
    };

    isEditAllowed = (theOwner, theUser) => {
        // Editing of an existing article is allowed if the current user is the owner
        if (theOwner && theOwner._id && theUser && theOwner._id === theUser._id) {
            return true;
        }
        // Or editing is allowed if there is no owner yet (new article) and a user is logged in
        else if (!theOwner && theUser) {
            return true;
        }
        return false;
    };

    getSubTitle = (isEditAllowed) => {
        if (this.state.articleFound) {
            if (isEditAllowed) {
                if (this.props.match.params.articleId) {
                    return 'Artikel bearbeiten';
                }
                else {
                    return 'Neuer Artikel erfassen';
                }
            }
            else {
                return 'Artikel ansehen';
            }
        }
        else {
            return 'Artikel nicht gefunden';
        }
    };

    render() {
        const { user, loading } = this.props;
        const { title, description, categories, photos, status, created, owner, trades, errors, modified, articleFound, addedPhotos, removedPhotos } = this.state;
        let isEditAllowed = this.isEditAllowed(owner, user);
        let photosToRender = photos.filter(photo => !removedPhotos.some(removedPhoto => removedPhoto === photo));
        addedPhotos.forEach(photo => {
            photosToRender.push(photo);
        });
        return (
            <div>
                <ApplicationBar subtitle={this.getSubTitle(isEditAllowed)}/>
                <ContentContainer>
                    {articleFound ? (
                        <form className="article-form" onSubmit={this.onSubmit}>
                            <ArticleDetails
                                isDisplayMode={!isEditAllowed}
                                article={{title, description, categories, status, created, owner, trades}}
                                errors={errors}
                                loading={loading}
                                onChange={this.onChange}
                                onSubmit={this.onSubmit}
                                onAddCategory={this.onAddCategory}
                                onRemoveCategory={this.onRemoveCategory}
                                onPhotoLoaded={this.onPhotoLoaded}
                                onRemovePhoto={this.onRemovePhoto}/>
                            <PhotosComponent
                                isDisplayMode={!isEditAllowed}
                                photos={photosToRender}
                                onPhotoLoaded={this.onPhotoLoaded}
                                onRemovePhoto={this.onRemovePhoto}
                                onSelectMainPhoto={this.onSelectMainPhoto}
                                loading={loading}/>
                            {isEditAllowed &&
                                <PageButton isSubmit={true} disabled={loading || !modified}>
                                    <SaveIcon/>
                                </PageButton>
                            }
                        </form>
                    ) : (
                        <Placeholder width={300} height={300} loading={loading} text="Artikel nicht gefunden" loadingText="... Artikel wird geladen ..."/>
                    )}
                </ContentContainer>
            </div>
        );
    }
}
