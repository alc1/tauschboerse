import { connect } from 'react-redux';

import UserArticlesPage from '../components/UserArticlesPage/UserArticlesPage';

import { setLoading } from '../store/actions/application';
import { loadUserArticles, filterUserArticles } from '../store/actions/user';
import { deleteArticle } from '../store/actions/article';
import { isLoading } from '../store/selectors/application';
import { getFilteredUserArticles, getUser, getUserArticlesFilter } from '../store/selectors/user';

function mapStateToProps(theState) {
    return {
        articles: getFilteredUserArticles(theState),
        user: getUser(theState),
        loading: isLoading(theState),
        userArticlesFilter: getUserArticlesFilter(theState)
    };
}

export default connect(mapStateToProps, { loadUserArticles, filterUserArticles, deleteArticle, setLoading })(UserArticlesPage);
