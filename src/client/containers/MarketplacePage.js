import React from 'react';

import ApplicationBar from '../components/ApplicationBar';
import GlobalMessageComponent from '../components/GlobalMessageComponent';

class MarketplacePage extends React.Component {
    render() {
        return (
            <div>
                <ApplicationBar/>
                <div>Suche</div>
                <div>Artikelliste (Suchresaultate)</div>
                <GlobalMessageComponent/>
            </div>
        );
    }
}

export default MarketplacePage;
