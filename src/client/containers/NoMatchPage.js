import React from 'react';

import ApplicationBar from '../components/ApplicationBar';
import GlobalMessageComponent from '../components/GlobalMessageComponent';

const NoMatchPage = ({ location }) => (
    <div>
        <ApplicationBar/>
        <p>No match for route: <code>{location.pathname}</code></p>
        <GlobalMessageComponent/>
    </div>
);

export default NoMatchPage;
