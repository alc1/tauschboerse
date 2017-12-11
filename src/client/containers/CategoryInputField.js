import { connect } from 'react-redux';

import CategoryInputField from '../components/CategoryInputField';

import { loadCategories } from '../actions/category';
import { getCategories } from '../selectors/category';

function mapStateToProps(theState) {
    return {
        availableCategories: getCategories(theState)
    };
}

export default connect(mapStateToProps, { loadCategories })(CategoryInputField);
