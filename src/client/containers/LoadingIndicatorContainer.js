import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoadingIndicatorComponent from '../components/LoadingIndicatorComponent';

import { isLoading } from '../selectors/application';

class LoadingIndicatorContainer extends React.Component {

    static propTypes = {
        loading: PropTypes.bool.isRequired
    };

    render() {
        const { loading } = this.props;
        return (
            <LoadingIndicatorComponent loading={loading}/>
        );
    }
}

function mapStateToProps(theState) {
    return {
        loading: isLoading(theState)
    };
}

export default connect(mapStateToProps, null)(LoadingIndicatorContainer);