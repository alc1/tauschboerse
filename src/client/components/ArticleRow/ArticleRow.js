import React from 'react';
import PropTypes from 'prop-types';

import './ArticleRow.css';

export default class ArticleRow extends React.Component {

    static propTypes = {
        article: PropTypes.array.isRequired,
    };
    
    render() {
        return (
            <div></div>
        );
    }
}
