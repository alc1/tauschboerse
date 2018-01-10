import { connect } from 'react-redux';

import ArticleEditorPage from '../components/ArticleEditorPage/ArticleEditorPage';

import { setGlobalMessage } from '../store/actions/application';
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
    removeSelectedArticle,
    setGlobalMessage
})(ArticleEditorPage);
