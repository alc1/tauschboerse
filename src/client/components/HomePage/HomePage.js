import React from 'react';
import PropTypes from 'prop-types';

import ApplicationBar from '../../containers/ApplicationBar';
import Dashboard from '../../containers/Dashboard';
import Intro from '../../containers/Intro';
import ContentContainer from '../ContentContainer/ContentContainer';

export default class HomePage extends React.Component {

    static propTypes = {
        user: PropTypes.object
    };

    render() {
        const { user } = this.props;
        return (
            <div>
                <ApplicationBar/>
                <ContentContainer>
                    {!user ? (
                        <Intro/>
                    ) : (
                        <Dashboard user={user}/>
                    )}
                </ContentContainer>
            </div>
        );
    }
}
