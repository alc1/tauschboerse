import React from 'react';

import ApplicationBar from '../../containers/ApplicationBar';
import Placeholder from '../Placeholder/Placeholder';

const NoMatchPage = ({ location, muiTheme }) => (
    <div>
        <ApplicationBar/>
        <Placeholder width={300} height={300}  muiTheme={muiTheme} text={
            <div>
                <div>Seite nicht gefunden:</div>
                <code>{location.pathname}</code>
            </div>
        }/>
    </div>
);

export default NoMatchPage;
