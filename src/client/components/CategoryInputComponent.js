import React from 'react';
import PropTypes from 'prop-types';

import ChipInput from 'material-ui-chip-input';

const styles = { width: '90%' };

export default class CategoryInputFieldComponent extends React.Component {

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        categories: PropTypes.array.isRequired,
        availableCategories: PropTypes.array.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onAddCategory: PropTypes.func,
        onRemoveCategory: PropTypes.func
    };

    static defaultProps = {
        isDisplayMode: false
    };

    onAddCategory = (theCategoryName, event) => {
        if (!this.props.isDisplayMode && this.props.onAddCategory) {
            if (event && event.relatedTarget && this.isCategoryName(event.relatedTarget.textContent)) {
                return;
            }
            if (!this.isAlreadyAdded(theCategoryName)) {
                this.props.onAddCategory(theCategoryName);
            }
        }
    };

    isAlreadyAdded = (theCategoryName) => {
        return !!this.props.categories.find(category => category.name === theCategoryName);
    };

    isCategoryName = (theText) => {
        return !!this.props.availableCategories.find(category => category.name === theText);
    };

    render() {
        const { isDisplayMode, categories, availableCategories, errors, loading, onRemoveCategory } = this.props;
        return (
            <ChipInput
                className="input-component"
                style={styles}
                errorText={errors.categories}
                hintText="Kategorien"
                floatingLabelText="Kategorien"
                name="categories"
                value={categories.map(category => category.name)}
                onRequestAdd={(categoryName) => this.onAddCategory(categoryName)}
                onBlur={(event) => this.onAddCategory(event.target.value, event)}
                onRequestDelete={(!isDisplayMode && onRemoveCategory) ? ((categoryName) => onRemoveCategory(categoryName)) : undefined}
                disabled={isDisplayMode || loading}
                filter={(searchText, categoryName) => (categoryName.indexOf(searchText) !== -1)}
                dataSource={availableCategories.map(category => category.name)}
            />
        );
    }
}
