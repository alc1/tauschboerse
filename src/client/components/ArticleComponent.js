import React from 'react';
import PropTypes from 'prop-types';

class ArticleComponent extends React.Component {
    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <span>{this.props.description}</span><br/>
                <span>(ID: {this.props.id})</span>
            </div>
        );
    }
}

export default ArticleComponent;

ArticleComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};
