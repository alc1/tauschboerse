import React from 'react';

import ApplicationBar from '../components/ApplicationBar';

class MarketplacePage extends React.Component {
    render() {
        return (
            <div>
                <ApplicationBar/>
                <div>Suche</div>
                <div>Artikelliste (Suchresaultate)</div>
            </div>
        );
    }
}

export default MarketplacePage;
