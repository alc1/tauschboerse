import React from 'react';

import ApplicationBar from '../components/ApplicationBar';

const NoMatchPage = ({ location }) => (
    <div>
        <ApplicationBar/>
        <p>No match for route: <code>{location.pathname}</code></p>
    </div>
);

export default NoMatchPage;
