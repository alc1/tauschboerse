import React from 'react';

import ApplicationBar from '../../containers/ApplicationBar';
import Placeholder from '../../containers/Placeholder';
import ContentContainer from '../ContentContainer/ContentContainer';

const NoMatchPage = ({ location }) => (
    <div>
        <ApplicationBar/>
        <ContentContainer>
            <Placeholder width={300} height={300} text={`Seite nicht gefunden: ${location.pathname}`}/>
        </ContentContainer>
    </div>
);

export default NoMatchPage;
