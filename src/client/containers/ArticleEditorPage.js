import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import uuid from 'uuid';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Save from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../components/ApplicationBar';
import GlobalMessageComponent from '../components/GlobalMessageComponent';
import ArticleForm from '../components/ArticleForm';
import PhotosComponent from '../components/PhotosComponent';

import { setLoading } from '../actions/application';
import { loadArticle, createArticle, updateArticle } from '../actions/article';
import { isLoading } from '../selectors/application';
import { getArticle } from '../selectors/article';
import { getUser } from '../selectors/user';

import { FLOATING_ACTION_BUTTON_POSITION_STYLE } from '../common';

import articleDetailsValidator from '../../shared/validations/articleDetails';

import Article from '../../shared/businessobjects/Article';

import './ArticleEditorPage.css';

class ArticleEditorPage extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        user: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        loadArticle: PropTypes.func.isRequired,
        createArticle: PropTypes.func.isRequired,
        updateArticle: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        title: '',
        description: '',
        categories: [],
        photos: [],
        created: {},
        owner: {},
        errors: {},
        modified: false
    };

    componentDidMount() {
        this.props.setLoading(true);
        const { articleId } = this.props.match.params;
        if (articleId) {
            this.props.loadArticle(articleId)
                .then(() => {
                    this.props.setLoading(false);
                    const { article } = this.props;
                    this.setState({
                        title: article ? article.title : this.state.title,
                        description: article ? article.description : this.state.description,
                        categories: article ? article.categories : this.state.categories,
                        photos: article ? article.photos : this.state.photos,
                        created: article ? article.created : this.state.created,
                        owner: article ? article.owner : this.state.owner
                    });
                })
                .catch(() => this.props.setLoading(false));
        }
        else {
            this.props.setLoading(false);
        }
    }

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
            isNew: true
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

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.props.setLoading(true);
        const { user } = this.props;
        const { title, description, categories, photos, created } = this.state;
        const { articleId } = this.props.match.params;
        let articleToSave = new Article({ title, description, categories, photos });
        const validation = articleDetailsValidator.validate(articleToSave);
        if (validation.isValid) {
            let articleRequest;
            if (articleId) {
                articleToSave._id = articleId;
                articleToSave.created = created;
                articleRequest = this.props.updateArticle(user._id, articleToSave);
            }
            else {
                articleRequest = this.props.createArticle(articleToSave);
            }
            articleRequest.then(() => {
                this.props.setLoading(false);
                this.props.history.goBack();
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
        const { title, description, categories, photos, owner, errors, modified } = this.state;
        let isUserPermitted = true;
        if (owner._id && owner._id !== user._id) {
            isUserPermitted = false;
        }
        return (
            <div>
                <ApplicationBar/>
                {isUserPermitted ?
                    <form className="article-editor__container" onSubmit={this.onSubmit}>
                        <ArticleForm
                            title={title}
                            description={description}
                            categories={categories}
                            photos={photos}
                            errors={errors}
                            loading={loading}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                            onAddCategory={this.onAddCategory}
                            onRemoveCategory={this.onRemoveCategory}
                            onPhotoLoaded={this.onPhotoLoaded}
                            onRemovePhoto={this.onRemovePhoto}/>
                        <PhotosComponent
                            photos={photos}
                            onPhotoLoaded={this.onPhotoLoaded}
                            onRemovePhoto={this.onRemovePhoto}
                            loading={loading}/>
                        <FloatingActionButton
                            style={FLOATING_ACTION_BUTTON_POSITION_STYLE}
                            type="submit"
                            disabled={loading || !modified}>
                            <Save/>
                        </FloatingActionButton>
                    </form>
                    :
                    <Redirect to="/"/>}
                <GlobalMessageComponent/>
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

export default connect(mapStateToProps, { loadArticle, createArticle, updateArticle, setLoading })(ArticleEditorPage);
