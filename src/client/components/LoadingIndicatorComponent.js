import React from 'react';

import LinearProgress from 'material-ui/LinearProgress';

export default class LoadingIndicatorComponent extends React.Component {
    render() {
        const { loading } = this.props;
        return (
            <div>
                {loading && <LinearProgress style={{position: 'fixed'}} mode="indeterminate" color="#FF9800"/>}
            </div>
        );
    }
}
