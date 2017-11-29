import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

import ArticleStatusComponent from './ArticleStatusTag';
import AvatarTag from './AvatarTag';
import NoPhotoComponent from './NoPhotoComponent';

import './ArticleComponent.css';

class ArticleComponent extends React.Component {

    static propTypes = {
        article: PropTypes.object.isRequired,
        actions: PropTypes.array.isRequired
    };

    static defaultProps = {
        actions: []
    };

    render() {
        const { article, actions } = this.props;
        const { title, description, status, owner, categories, photos, created } = article;
        const name = (owner) ? owner.name : '';
        const categoryNames = (categories) ? categories.map(category => category.name).join(', ') : '';
        const photoSource = (photos && photos.length > 0) ? photos[0].url : null;
        return (
            <div className="article-card">
                <Card>
                    <div className="article-card__header">
                        <AvatarTag text={name}/>
                        <AvatarTag text={`${moment(created).format('DD.MM.YYYY | HH:mm')}`} icon={<EditIcon/>}/>
                        <ArticleStatusComponent status={status}/>
                    </div>
                    <CardMedia overlay={<CardTitle title={title} subtitle={categoryNames}/>}>
                        <div className="article-card__image-container">
                            {photoSource ? <img className="article-card__image" src={photoSource} alt={title}/> : <NoPhotoComponent/>}
                        </div>
                    </CardMedia>
                    <CardText className="article-card__text">{description}</CardText>
                    <CardActions>{actions}</CardActions>
                </Card>
            </div>
        );
    }
}

export default ArticleComponent;
