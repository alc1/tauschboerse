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
                        owner: article ? article.owner : this.state.owner,
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
        const { user, article } = this.props;
        const { title, description, categories } = this.state;
        const { articleId } = this.props.match.params;
        let articleToSave = new Article({ ...article, title, description, categories });
        const validation = articleDetailsValidator.validate(articleToSave);
        if (validation.isValid) {
            let articleRequest;
            if (articleId) {
                articleToSave._id = articleId;
                articleRequest = this.props.updateArticle(user._id, articleToSave);
            }
            else {
                articleRequest = this.props.createArticle(articleToSave);
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
        const { title, description, categories, owner, errors, loading, modified } = this.state;
        let isUserPermitted = true;
        if (owner._id && owner._id !== user._id) {
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