import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import NavigationComponent from './components/NavigationComponent';
import HomePage from './containers/HomePage';
import UserArticlesPage from './containers/UserArticlesPage';
import MarketplacePage from './containers/MarketplacePage';
import IncomingExchangesPage from './containers/IncomingExchangesPage';
import OutgoingExchangesPage from './containers/OutgoingExchangesPage';
import ArticleDetailPage from './containers/ArticleDetailPage';

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

class App extends React.Component {
    render() {
        return (
            <BrowserRouter history={history}>
                <div>
                    <h1>Tauschbörse</h1>
                    <NavigationComponent/>
                    <hr/>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/userarticles/:userId" component={UserArticlesPage}/>
                    <Route exact path="/marketplace" component={MarketplacePage}/>
                    <Route exact path="/exchanges/incoming" component={IncomingExchangesPage}/>
                    <Route exact path="/exchanges/outgoing" component={OutgoingExchangesPage}/>
                    <Route exact path="/article/:articleId" component={ArticleDetailPage}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
