import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import AvatarTag from '../AvatarTag/AvatarTag';
import ArticleStatusComponent from '../ArticleStatusTag/ArticleStatusTag';
import InputComponent from '../InputComponent/InputComponent';
import CategoryInputField from '../../containers/CategoryInputField';

import './ArticleFieldsBox.css';

const toolbarTitleStyle = { color: 'black' };

export default class ArticleFieldsBox extends React.Component {

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        article: PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            categories: PropTypes.array.isRequired,
            status: PropTypes.string,
            created: PropTypes.string,
            owner: PropTypes.object,
            trades: PropTypes.object
        }).isRequired,
        loading: PropTypes.bool.isRequired,
        errors: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        onAddCategory: PropTypes.func,
        onRemoveCategory: PropTypes.func
    };

    static defaultProps = {
        errors: {}
    };

    componentDidMount() {
        this.firstInputFieldTimeout = setTimeout(() => this.firstInputElement.focus(), 500);
    }

    componentWillUnmount() {
        clearTimeout(this.firstInputFieldTimeout);
    }

    render() {
        const { isDisplayMode, article, errors, loading, onChange, onAddCategory, onRemoveCategory } = this.props;
        let title = '', description = '', categories = [], status = null, owner = null, created = null;
        if (article) {
            title = article.title ? article.title : title;
            description = article.description ? article.description : description;
            categories = article.categories ? article.categories : categories;
            status = article.status ? article.status : status;
            owner = article.owner ? article.owner.name : owner;
            created = article.created ? moment(article.created).format('DD.MM.YYYY | HH:mm') : created;
        }
        return (
            <section className="article-fields">
                <Paper>
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Artikeldetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="article-fields__container">
                        <div className="article-fields__properties">
                            {owner && <AvatarTag text={owner} icon={<AccountIcon/>}/>}
                            {created && <AvatarTag text={created} icon={<EditIcon/>}/>}
                            {status && <ArticleStatusComponent status={status}/>}
                        </div>
                        <InputComponent
                            setElementRef={element => this.firstInputElement = element}
                            isDisplayMode={isDisplayMode}
                            error={errors.title}
                            label={isDisplayMode ? 'Titel' : 'Titel *'}
                            onChange={onChange}
                            value={title}
                            field="title"
                            disabled={loading}/>
                        <InputComponent
                            isDisplayMode={isDisplayMode}
                            error={errors.description}
                            label="Beschreibung"
                            onChange={onChange}
                            value={description}
                            field="description"
                            multiLine={true}
                            disabled={loading}/>
                        <CategoryInputField
                            isDisplayMode={isDisplayMode}
                            categories={categories}
                            errors={errors}
                            loading={loading}
                            onAddCategory={onAddCategory}
                            onRemoveCategory={onRemoveCategory}
                            allowNewValues={true}/>
                        {!isDisplayMode && <span className="article-fields__hint">* Obligatorisches Feld</span>}
                    </div>
                </Paper>
            </section>
        );
    }
}
