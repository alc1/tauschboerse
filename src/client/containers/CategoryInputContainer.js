import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CategoryInputFieldComponent from '../components/CategoryInputComponent';

import { loadCategories } from '../actions/category';
import { getCategories } from '../selectors/category';

class CategoryInputFieldContainer extends React.Component {

    static propTypes = {
        isDisplayMode: PropTypes.bool.isRequired,
        categories: PropTypes.array.isRequired,
        availableCategories: PropTypes.array.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        loadCategories: PropTypes.func.isRequired,
        allowNewValues: PropTypes.bool.isRequired,
        onAddCategory: PropTypes.func,
        onRemoveCategory: PropTypes.func
    };

    static defaultProps = {
        allowNewValues: true
    };

    componentDidMount() {
        this.props.loadCategories();
    }

    onAddCategory = (theCategoryName) => {
        if (theCategoryName) {
            let foundCategory = this.props.availableCategories.find(category => category.name === theCategoryName);
            if (foundCategory) {
                this.props.onAddCategory(foundCategory);
            }
            else if (this.props.allowNewValues) {
                this.props.onAddCategory({ name: theCategoryName });
            }
        }
    };

    render() {
        const { isDisplayMode, categories, availableCategories, errors, loading, onAddCategory, onRemoveCategory } = this.props;
        return (
            <CategoryInputFieldComponent
                isDisplayMode={isDisplayMode}
                categories={categories}
                availableCategories={availableCategories}
                errors={errors}
                loading={loading}
                onAddCategory={onAddCategory ? this.onAddCategory : undefined}
                onRemoveCategory={onRemoveCategory}/>
        );
    }
}

function mapStateToProps(theState) {
    return {
        availableCategories: getCategories(theState)
    };
}

export default connect(mapStateToProps, { loadCategories })(CategoryInputFieldContainer);
