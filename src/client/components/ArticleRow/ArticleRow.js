import React from 'react';
import PropTypes from 'prop-types';

import './ArticleRow.css';

export default class ArticleRow extends React.Component {

    static propTypes = {
        article: PropTypes.object.isRequired,
        selectable: PropTypes.bool.isRequired,
        selected: PropTypes.bool.isRequired
    };
    
    static defaultProps = {
        selectable: false,
        selected: false
    }

    render() {
        return (
            <div className="article-row_container">
            </div>
        );
    }
}
