import React from 'react';
import PropTypes from 'prop-types';

import ChipInput from 'material-ui-chip-input';

const styles = { width: '90%' };

export default class CategoryInputFieldComponent extends React.Component {

    static propTypes = {
        categories: PropTypes.array.isRequired,
        availableCategories: PropTypes.array.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onAddCategory: PropTypes.func.isRequired,
        onRemoveCategory: PropTypes.func.isRequired
    };

    render() {
        const { categories, availableCategories, errors, loading, onAddCategory, onRemoveCategory } = this.props;
        return (
            <ChipInput
                style={styles}
                errorText={errors.categories}
                hintText="Kategorien"
                floatingLabelText="Kategorien"
                name="categories"
                value={categories.map(category => category.name)}
                onRequestAdd={(categoryName) => onAddCategory(categoryName)}
                onRequestDelete={(categoryName) => onRemoveCategory(categoryName)}
                disabled={loading}
                filter={(searchText, categoryName) => (categoryName.indexOf(searchText) !== -1)}
                dataSource={availableCategories.map(category => category.name)}
            />
        );
    }
}
