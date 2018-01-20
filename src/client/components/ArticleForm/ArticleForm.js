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
import TradeLink from '../../containers/TradeLink';

import './ArticleForm.css';

const toolbarTitleStyle = { color: 'black' };

export default class ArticleForm extends React.Component {

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
        errors: PropTypes.object,
        onChange: PropTypes.func,
        onAddCategory: PropTypes.func,
        onRemoveCategory: PropTypes.func
    };

    static defaultProps = {
        errors: {}
    };

    componentDidMount() {
        this.firstInputFieldTimeout = setTimeout(() => this.firstInputElement.focus(), 1000);
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
            <div className="article-form__container">
                <Paper className="article-form__paper">
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text="Artikeldetails"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="article-form__field-container">
                        <div className="article-form__properties">
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
                        {!isDisplayMode && <span className="article-form__hint-text">* Obligatorisches Feld</span>}
                    </div>
                </Paper>
                {article.trades && article.trades.allTrades.length > 0 &&
                    <Paper className="article-form__trades">
                        <Toolbar>
                            <ToolbarGroup>
                                <ToolbarTitle style={toolbarTitleStyle} text="Involviert in:"/>
                            </ToolbarGroup>
                        </Toolbar>
                        <div className="article-form__trades-container">
                            {article.trades.allTrades.sort((trade1, trade2) => - moment(trade1.trade.createDate).format('YYYYMMDDHHmmss').localeCompare(moment(trade2.trade.createDate).format('YYYYMMDDHHmmss')))
                                .map(trade => <TradeLink key={trade._id} trade={trade} loading={loading}/>)}
                        </div>
                    </Paper>
                }
            </div>
        );
    }
}
