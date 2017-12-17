import { connect } from 'react-redux';

import LoadingIndicator from '../components/LoadingIndicator';

import { isLoading } from '../store/selectors/application';

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps)(LoadingIndicator);
