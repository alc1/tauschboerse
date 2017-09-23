import React from 'react';

const NoMatchPage = ({ location }) => (
    <div>
        <p>No match for route: <code>{location.pathname}</code></p>
    </div>
);

export default NoMatchPage;
