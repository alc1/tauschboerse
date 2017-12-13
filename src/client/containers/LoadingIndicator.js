import { connect } from 'react-redux';

import LoadingIndicator from '../components/LoadingIndicator';

import { isLoading } from '../selectors/application';

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps)(LoadingIndicator);
