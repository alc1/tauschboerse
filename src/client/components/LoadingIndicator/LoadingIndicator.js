import React from 'react';
import PropTypes from 'prop-types';

import LinearProgress from 'material-ui/LinearProgress';
import { orange500 } from 'material-ui/styles/colors';

const componentStyles = { position: 'fixed' };

export default class LoadingIndicator extends React.Component {

    static propTypes = {
        loading: PropTypes.bool.isRequired
    };

    render() {
        return (
            <div>
                {this.props.loading && <LinearProgress style={componentStyles} color={orange500} mode="indeterminate"/>}
            </div>
        );
    }
}
