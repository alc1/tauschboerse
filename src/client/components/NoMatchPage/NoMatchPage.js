import React from 'react';

import ApplicationBar from '../../containers/ApplicationBar';
import Placeholder from '../../containers/Placeholder';

const NoMatchPage = ({ location }) => (
    <div>
        <ApplicationBar/>
        <Placeholder width={300} height={300} text={`Seite nicht gefunden: ${location.pathname}`}/>
    </div>
);

export default NoMatchPage;
