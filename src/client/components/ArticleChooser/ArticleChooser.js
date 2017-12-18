import React from 'react';
import PropTypes from 'prop-types';

import './ArticleChooser.css';

export default class ArticleChooser extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    };

    // generateArticleWrappers() {
        
    // }
    
    render() {
        return (
            <div className="article-chooser_container">Choosing articles from {this.props.user.name}...</div>
        );
    }
}
