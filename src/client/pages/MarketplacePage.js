import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../components/ApplicationBar';
import ArticleSearchComponent from '../components/ArticleSearchComponent';

class MarketplacePage extends React.Component {

    constructor(props) {
        super(props);
    }

    // static propTypes = {
    //     articles: PropTypes.array,
    //     user: PropTypes.object.isRequired,
    //     loading: PropTypes.bool.isRequired,
    //     findArticles: PropTypes.func.isRequired,
    //     setLoading: PropTypes.func.isRequired,
    //     history: PropTypes.object.isRequired
    // };

    // state = {
    //     title: '',
    //     description: '',
    //     categories: [],
    //     photos: [],
    //     status: '',
    //     created: {},
    //     owner: {},
    //     errors: {},
    //     modified: false
    // };

    // componentDidMount() {
    //     this.props.setLoading(true);
    //     const { articleId } = this.props.match.params;
    //     if (articleId) {
    //         this.props.loadArticle(articleId)
    //             .then(() => {
    //                 this.props.setLoading(false);
    //                 const { article } = this.props;
    //                 this.setState({
    //                     title: article ? article.title : this.state.title,
    //                     description: article ? article.description : this.state.description,
    //                     categories: article ? article.categories : this.state.categories,
    //                     photos: article ? article.photos : this.state.photos,
    //                     status: article ? article.status : this.state.status,
    //                     created: article ? article.created : this.state.created,
    //                     owner: article ? article.owner : this.state.owner
    //                 });
    //             })
    //             .catch(() => this.props.setLoading(false));
    //     }
    //     else {
    //         this.props.setLoading(false);
    //     }
    // }

    // onChange = (theEvent) => {
    //     this.setState({
    //         [theEvent.target.name]: theEvent.target.value,
    //         modified: true
    //     });
    // };

    render() {
        return (
            <div>
                <ApplicationBar/>
                <ArticleSearchComponent />
            </div>
        );
    }
}

// function mapStateToProps(theState) {
//     return {
//         user: getUser(theState),
//         loading: isLoading(theState)
//     };
// }

//export default connect(mapStateToProps, { findArticles })(MarketplacePage);

export default MarketplacePage;
