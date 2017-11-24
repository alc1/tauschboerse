import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import ArticleComponent from '../components/ArticleComponent';

import './ArticleGridList.css';

export default class ArticleGridList extends React.Component {

    static propTypes = {
        articles: PropTypes.array.isRequired,
        articleActions: PropTypes.array.isRequired
    };

    static defaultProps = {
        articleActions: []
    };

    createActionButton = (theAction, theArticle, theIndex) => {
        const isPrimary = theAction.isPrimary;
        const isSecondary = theAction.isSecondary;
        if (theAction.isRaised) {
            return (<RaisedButton key={theIndex} icon={theAction.icon} label={theAction.label} onClick={theAction.onClick.bind(this, theArticle._id, theArticle.owner._id)} primary={isPrimary} secondary={isSecondary}/>);
        }
        else {
            return (<FlatButton key={theIndex} icon={theAction.icon} label={theAction.label} onClick={theAction.onClick.bind(this, theArticle._id, theArticle.owner._id)} primary={isPrimary} secondary={isSecondary}/>);
        }
    };

    createActionButtons = (theArticle, theArticleActions) => {
        let actionButtons = [];
        theArticleActions.forEach(articleAction => actionButtons.push(this.createActionButton(articleAction, theArticle, actionButtons.length)));
        return actionButtons;
    };

    render() {
        const { articles, articleActions } = this.props;
        const articleComponents = articles.map(article => <ArticleComponent key={article._id} article={article} actions={this.createActionButtons(article, articleActions)}/>);
        return (
            <div className="article-grid-list">
                {articleComponents}
            </div>
        );
    }
}
