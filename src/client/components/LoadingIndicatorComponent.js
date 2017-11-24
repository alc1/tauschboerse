import React from 'react';
import PropTypes from 'prop-types';

import LinearProgress from 'material-ui/LinearProgress';

export default class LoadingIndicatorComponent extends React.Component {

    static propTypes = {
        loading: PropTypes.bool.isRequired
    };

    render() {
        const { loading } = this.props;
        return (
            <div>
                {loading && <LinearProgress style={{position: 'fixed'}} mode="indeterminate" color="#FF9800"/>}
            </div>
        );
    }
}
