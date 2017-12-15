import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import SaveIcon from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../containers/ApplicationBar';
import Placeholder from '../containers/Placeholder';
import ArticleForm from '../components/ArticleForm';
import PhotosComponent from '../components/PhotosComponent';

import { setLoading, setGlobalMessage, OK_MESSAGE } from '../actions/application';
import { loadArticle, createArticle, updateArticle, removeSelectedArticle } from '../actions/article';
import { isLoading } from '../selectors/application';
import { getArticle } from '../selectors/article';
import { getUser } from '../selectors/user';

import { FLOATING_ACTION_BUTTON_POSITION_STYLE } from '../common';

import articleDetailsValidator from '../../shared/validations/articleDetails';

import Article from '../../shared/businessobjects/Article';

import './ArticleEditorPage.css';

class ArticleEditorPage extends React.Component {

    constructor(props) {
        super(props);
        this.articleFound = true;
    }

    static propTypes = {
        article: PropTypes.object,
        user: PropTypes.object.isRequired,
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
        errors: {},
        modified: false
    };

    componentDidMount() {
        const { articleId } = this.props.match.params;
        if (articleId) {
            this.props.setLoading(true);
            this.props.loadArticle(articleId)
                .then(() => {
                    this.props.setLoading(false);
                    this.updateArticleInState(this.props);
                })
                .catch(() => {
                    this.articleFound = false;
                    this.props.setLoading(false);
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
        const { modified, title, description, categories, photos, status, created, owner } = this.state;
        this.setState({
            title: article && !modified ? article.title : title,
            description: article && !modified ? article.description : description,
            categories: article && !modified ? article.categories : categories,
            photos: article && !modified ? article.photos : photos,
            status: article && !modified ? article.status : status,
            created: article && !modified ? article.created : created,
            owner: article && !modified ? article.owner : owner
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
            isMain: this.state.photos.length === 0
        };
        this.setState({
            photos: [...this.state.photos, newPhoto],
            modified: true
        });
    };

    onRemovePhoto = (thePhotoToRemove) => {
        this.setState({
            photos: this.state.photos.filter((photo) => photo.fileName !== thePhotoToRemove.fileName),
            modified: true
        });
    };

    onSelectMainPhoto = (theMainPhoto) => {
        this.setState({
            photos: this.state.photos.map(photo => {
                return { ...photo, isMain: photo.fileName === theMainPhoto.fileName };
            }),
            modified: true
        });
    };

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.props.setLoading(true);
        const { user } = this.props;
        const { title, description, categories, photos, created } = this.state;
        const { articleId } = this.props.match.params;
        let articleToSave = new Article({ title, description, categories, photos });
        const validation = articleDetailsValidator.validate(articleToSave);
        if (validation.isValid) {
            let articleSaveRequest;
            if (articleId) {
                articleToSave._id = articleId;
                articleToSave.created = created;
                articleSaveRequest = this.props.updateArticle(user._id, articleToSave);
            }
            else {
                articleSaveRequest = this.props.createArticle(articleToSave);
            }
            articleSaveRequest.then((res) => {
                this.setState({
                    errors: {},
                    modified: false
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

    render() {
        const { user, loading } = this.props;
        const { title, description, categories, photos, status, created, owner, errors, modified } = this.state;
        let isEditAllowed = true;
        if (owner && owner._id && owner._id !== user._id) {
            isEditAllowed = false;
        }
        return (
            <div>
                <ApplicationBar/>
                {this.articleFound ?
                    <form className="article-editor__container" onSubmit={this.onSubmit}>
                        <ArticleForm
                            isDisplayMode={!isEditAllowed}
                            article={{title, description, categories, photos, status, created, owner}}
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
                            photos={photos}
                            onPhotoLoaded={this.onPhotoLoaded}
                            onRemovePhoto={this.onRemovePhoto}
                            onSelectMainPhoto={this.onSelectMainPhoto}
                            loading={loading}/>
                        {isEditAllowed && <FloatingActionButton
                            style={FLOATING_ACTION_BUTTON_POSITION_STYLE}
                            type="submit"
                            disabled={loading || !modified}>
                            <SaveIcon/>
                        </FloatingActionButton>}
                    </form>
                    :
                    <Placeholder width={300} height={300} loading={loading} text="Keine Artikel gefunden" loadingText="... Artikel werden geladen ..."/>
                }
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        article: getArticle(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { loadArticle, createArticle, updateArticle, removeSelectedArticle, setLoading, setGlobalMessage })(ArticleEditorPage);
