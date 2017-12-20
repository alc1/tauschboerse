import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import Photo from '../Photo/Photo';
import AvatarTag from '../AvatarTag/AvatarTag';
import ArticleStatusTag from '../ArticleStatusTag/ArticleStatusTag';
import PhotoPlaceholder from '../PhotoPlaceholder/PhotoPlaceholder';

import './ArticleRow.css';

export default class ArticleRow extends React.Component {

    static propTypes = {
        article: PropTypes.object.isRequired,
        selectable: PropTypes.bool.isRequired,
        selected: PropTypes.bool.isRequired,
        onSelectionToggled: PropTypes.func.isRequired
    };
    
    static defaultProps = {
        selectable: false,
        selected: false
    };

    onSelectionToggled = (theEvent, isChecked) => {
        this.props.onSelectionToggled(this.props.article, isChecked);
    };

    render() {
        const { article, selected, selectable } = this.props;
        const { title, description, status, created, owner, categories, photos } = article;
        const name = (owner) ? owner.name : '';
        const categoryNames = (categories) ? categories.map(category => category.name).join(', ') : '';
        const mainPhoto = (photos && photos.length > 0) ? photos.find(photo => photo.isMain) : null;
        const mainPhotoIndex = (photos && photos.length > 0) ? photos.reduce((mainPhotoIndex, photo, index) => photo.isMain ? index : mainPhotoIndex, 0) : 0;
        const photoSource = (mainPhoto) ? mainPhoto.url : photos && photos.length > 0 ? photos[0].url : null;
        return (
            <Paper className="article-row__container">
                <div className="article-row__checkbox-column">
                    <Checkbox checked={selected} disabled={!selectable} onCheck={this.onSelectionToggled}/>
                </div>
                <div className="article-row__image-column">
                    {photoSource ? <Photo imageClassName="article-row__image" photos={photos} mainPhotoIndex={mainPhotoIndex}/> : <PhotoPlaceholder width={100} height={100}/>}
                </div>
                <div className="article-row__text-column">
                    <span className="article-row__title">{title}</span>
                    <span className="article-row__categories">{categoryNames}</span>
                    <span className="article-row__description">{description}</span>
                </div>
                <div>
                    <AvatarTag text={name} icon={<AccountIcon/>}/>
                    <AvatarTag text={`${moment(created).format('DD.MM.YYYY | HH:mm')}`} icon={<EditIcon/>}/>
                    <ArticleStatusTag status={status}/>
                </div>
            </Paper>
        );
    }
}
