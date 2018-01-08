import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import SaveIcon from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../../containers/ApplicationBar';
import Placeholder from '../../containers/Placeholder';
import ArticleForm from '../ArticleForm/ArticleForm';
import PhotosComponent from '../PhotosComponent/PhotosComponent';
import PageButton from '../PageButton/PageButton';

import { OK_MESSAGE } from '../../store/actions/application';

import articleDetailsValidator from '../../../shared/validations/articleDetails';

import './ArticleEditorPage.css';

export default class ArticleEditorPage extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        user: PropTypes.object,
        loading: PropTypes.bool.isRequired,
        loadArticle: PropTypes.func.isRequired,
        createArticle: PropTypes.func.isRequired,
        updateArticle: PropTypes.func.isRequired,
        removeSelectedArticle: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
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
                    this.updateArticleInState(this.props);
                })
                .catch(() => {
                    this.setState({ articleFound: false });
                });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.updateArticleInState(nextProps);
    }

    componentWillUnmount() {
        this.props.removeSelectedArticle();
    }

    updateArticleInState = (props) => {
        const { article } = props;
        const { modified, title, description, categories, photos, status, created, owner, trades } = this.state;
        this.setState({
            title: article && !modified ? article.title : title,
            description: article && !modified ? article.description : description,
            categories: article && !modified ? article.categories : categories,
            photos: article && !modified ? article.photos : photos,
            status: article && !modified ? article.status : status,
            created: article && !modified ? article.created : created,
            owner: article && !modified ? article.owner : owner,
            trades: article && !modified ? article.trades : trades
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
            fileName: uuid.v1() + theFile.name.substr(theFile.name.lastIndexOf('.')),
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
        if (this.isNewPhoto(thePhotoToRemove)) {
            this.setState({
                addedPhotos: this.state.addedPhotos.filter((photo) => photo.fileName !== thePhotoToRemove.fileName),
                modified: true
            });
        }
        else {
            this.setState({
                removedPhotos: [...this.state.removedPhotos, thePhotoToRemove],
                modified: true
            });
        }
    };

    onSelectMainPhoto = (theMainPhoto) => {
        if (this.isNewPhoto(theMainPhoto)) {
            this.setState({
                addedPhotos: this.state.addedPhotos.map(photo => {
                    return { ...photo, isMain: photo.fileName === theMainPhoto.fileName };
                }),
                photos: this.state.photos.map(photo => {
                    photo.isMain = false;
                    return photo;
                }),
                modified: true
            });
        }
        else {
            this.setState({
                photos: this.state.photos.map(photo => {
                    return { ...photo, isMain: photo.fileName === theMainPhoto.fileName };
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
        return this.state.addedPhotos.some(photo => photo.fileName === thePhoto.fileName);
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.props.setLoading(true);
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
                articleSaveRequest = this.props.updateArticle(user._id, articleToSave, addedPhotos, removedPhotos);
            }
            else {
                articleSaveRequest = this.props.createArticle(articleToSave, addedPhotos);
            }
            articleSaveRequest.then((res) => {
                this.setState({
                    errors: {},
                    modified: false,
                    addedPhotos: [],
                    removedPhotos: []
                });
                this.props.setLoading(false);
                this.props.setGlobalMessage({
                    messageText: 'Artikel wurde gespeichert.',
                    messageType: OK_MESSAGE
                });
                if (!articleId) {
                    this.props.history.replace(`/article/${res.article._id}`);
                }
            }).catch((err) => {
                this.props.setLoading(false);
                this.setState({ errors: err.response.data.errors || {} });
            });
        }
        else {
            this.props.setLoading(false);
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
        let photosToRender = photos.filter(photo => !removedPhotos.some(removedPhoto => removedPhoto.fileName === photo.fileName));
        addedPhotos.forEach(photo => {
            photosToRender.push(photo);
        });
        return (
            <div>
                <ApplicationBar subtitle={this.getSubTitle(isEditAllowed)}/>
                {articleFound ? (
                    <form className="article-editor__container" onSubmit={this.onSubmit}>
                        <ArticleForm
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
                        {isEditAllowed && <PageButton isSubmit={true} disabled={loading || !modified}>
                            <SaveIcon/>
                        </PageButton>}
                    </form>
                ) : (
                    <Placeholder width={300} height={300} loading={loading} text="Artikel nicht gefunden" loadingText="... Artikel wird geladen ..."/>
                )}
            </div>
        );
    }
}
