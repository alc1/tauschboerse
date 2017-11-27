import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import ApplicationBar from '../components/ApplicationBar';
import ArticleForm from '../components/ArticleForm';
import PhotosComponent from '../components/PhotosComponent';

import { setLoading } from '../actions/application';
import { loadArticle } from '../actions/article';
import { isLoading } from '../selectors/application';
import { getArticle } from '../selectors/article';

import './ArticleDetailPage.css';

class ArticleDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.isDisplayMode = true;
    }

    static propTypes = {
        article: PropTypes.object,
        loading: PropTypes.bool.isRequired,
        loadArticle: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { articleId } = this.props.match.params;
        if (articleId) {
            this.props.setLoading(true);
            this.props.loadArticle(articleId)
                .then(() => this.props.setLoading(false))
                .catch(() => this.props.setLoading(false));
        }
    }

    render() {
        const { article, loading } = this.props;
        let title = '', description = '', categories = [], photos = [], owner = '', created = '';
        if (article) {
            title = article ? article.title : title;
            description = article ? article.description : description;
            categories = article ? article.categories : categories;
            photos = article ? article.photos : photos;
            owner = article ? (article.owner ? article.owner.name : owner) : owner;
            created = article ? moment(article.created).format('DD.MM.YYYY | HH:mm') : created;
        }

        return (
            <div>
                <ApplicationBar/>
                <div className="article-detail__container">
                    <ArticleForm
                        isDisplayMode={this.isDisplayMode}
                        title={title}
                        description={description}
                        categories={categories}
                        photos={photos}
                        owner={owner}
                        created={created}
                        loading={loading}/>
                    <PhotosComponent
                        isDisplayMode={this.isDisplayMode}
                        photos={photos}
                        loading={loading}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(theState) {
    return {
        article: getArticle(theState),
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, { loadArticle, setLoading })(ArticleDetailPage);
