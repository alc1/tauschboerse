import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import Save from 'material-ui/svg-icons/content/save';

import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';
import ArticleForm from '../components/ArticleForm';
import { loadArticle, createArticle, updateArticle } from '../actions/article';
import { getArticle } from '../selectors/article';
import { getUser } from '../selectors/user';

import articleDetailsValidator from '../../shared/validations/articleDetails';

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
        articleUser: {},
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
                        articleUser: article ? article.user : this.state.articleUser,
                        loading: false
                    });
                })
                .catch((err) => this.setState({loading: false}));
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

    onSubmit = (theEvent) => {
        theEvent.preventDefault();
        this.setState({ loading: true });
        const { user } = this.props;
        const { title, description, categories } = this.state;
        const validation = articleDetailsValidator.validate({ title, description, categories });
        if (validation.isValid) {
            let articleRequest;
            const { articleId } = this.props.match.params;
            if (articleId) {
                articleRequest = this.props.updateArticle(user._id, articleId, title, description, categories);
            }
            else {
                articleRequest = this.props.createArticle(title, description, categories);
            }
            articleRequest.then((res) => {
                this.props.history.replace(`/article/${res.article._id}`);
            }).catch((err) => this.setState({
                errors: err.response.data.errors,
                loading: false
            }));
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
        const { title, description, categories, articleUser, errors, loading, modified } = this.state;
        let isUserPermitted = true;
        if (articleUser._id && articleUser._id !== user._id) {
            isUserPermitted = false;
        }
        return (
            <div>
                <LoadingIndicatorComponent loading={loading}/>
                {isUserPermitted ?
                    <ArticleForm
                        title={title}
                        description={description}
                        categories={categories}
                        errors={errors}
                        loading={loading}
                        onChange={this.onChange}
                        onSubmit={this.onSubmit}
                        onAddCategory={this.onAddCategory}
                        onRemoveCategory={this.onRemoveCategory}>
                        <RaisedButton type="submit" label="Speichern" icon={<Save/>} disabled={loading || !modified} primary/>
                    </ArticleForm>
                    :
                    <Redirect to="/"/>}
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
