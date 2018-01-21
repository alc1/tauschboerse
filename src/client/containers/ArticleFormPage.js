import { connect } from 'react-redux';

import ArticleFormPage from '../components/ArticleFormPage/ArticleFormPage';

import { loadArticle, createArticle, updateArticle, removeSelectedArticle } from '../store/actions/article';
import { isLoading } from '../store/selectors/application';
import { getArticle } from '../store/selectors/article';
import { getUser } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        article: getArticle(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, {
    loadArticle,
    createArticle,
    updateArticle,
    removeSelectedArticle
})(ArticleFormPage);
