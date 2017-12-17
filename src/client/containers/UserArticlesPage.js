import { connect } from 'react-redux';

import UserArticlesPage from '../components/UserArticlesPage/UserArticlesPage';

import { setLoading } from '../store/actions/application';
import { loadUserArticles } from '../store/actions/user';
import { deleteArticle } from '../store/actions/article';
import { isLoading } from '../store/selectors/application';
import { getUserArticles, getUser } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        articles: getUserArticles(theState),
        user: getUser(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { loadUserArticles, deleteArticle, setLoading })(UserArticlesPage);
