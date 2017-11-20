import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import uuid from 'uuid';

import RaisedButton from 'material-ui/RaisedButton';
import Save from 'material-ui/svg-icons/content/save';

import ApplicationBar from '../components/ApplicationBar';
import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import GlobalMessageComponent from '../components/GlobalMessageComponent';
import ArticleForm from '../components/ArticleForm';

import { loadArticle, createArticle, updateArticle } from '../actions/article';
import { getArticle } from '../selectors/article';
import { getUser } from '../selectors/user';

import articleDetailsValidator from '../../shared/validations/articleDetails';

import Article from '../../shared/businessobjects/Article';

class ArticleEditorPage extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        user: PropTypes.object.isRequired,
        loadArticle: PropTypes.func.isRequired,
        createArticle: PropTypes.func.isRequired,
        updateArticle: PropTypes.func.isRequired,
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
        loading: false,
        modified: false
    };

    componentDidMount() {
        this.setState({ loading: true });
        const { articleId } = this.props.match.params;
        if (articleId) {
            this.props.loadArticle(articleId)
                .then((res) => {
                    const { article } = this.props;
                    this.setState({
                        title: article ? article.title : this.state.title,
                        description: article ? article.description : this.state.description,
                        categories: article ? article.categories : this.state.categories,
                        photos: article ? article.photos : this.state.photos,
                        created: article ? article.created : this.state.created,
                        owner: article ? article.owner : this.state.owner,
                        loading: false
                    });
                })
                .catch((err) => this.setState({ loading: false }));
        }
        else {
            this.setState({ loading: false });
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
        this.setState({ loading: true });
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
            articleRequest.then((res) => {
                this.props.history.replace(`/article/${res.article._id}`);
            }).catch((err) => {
                this.setState({
                    errors: err.response.data.errors || {},
                    loading: false
                });
            });
        }
        else {
            this.setState({
                errors: validation.errors,
                loading: false
            });
        }
    };

    render() {
        const { user } = this.props;
        const { title, description, categories, photos, owner, errors, loading, modified } = this.state;
        let isUserPermitted = true;
        if (owner._id && owner._id !== user._id) {
            isUserPermitted = false;
        }
        return (
            <div>
                <ApplicationBar/>
                <LoadingIndicatorComponent loading={loading}/>
                {isUserPermitted ?
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
                        onRemovePhoto={this.onRemovePhoto}>
                        <RaisedButton type="submit" label="Speichern" icon={<Save/>} disabled={loading || !modified} primary/>
                    </ArticleForm>
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
        user: getUser(theState)
    };
}

export default connect(mapStateToProps, { loadArticle, createArticle, updateArticle })(ArticleEditorPage);
