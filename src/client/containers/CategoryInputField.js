import { connect } from 'react-redux';

import CategoryInputField from '../components/CategoryInputField/CategoryInputField';

import { loadCategories } from '../store/actions/category';
import { getCategories } from '../store/selectors/category';

function mapStateToProps(theState) {
    return {
        availableCategories: getCategories(theState)
    };
}

export default connect(mapStateToProps, { loadCategories })(CategoryInputField);
