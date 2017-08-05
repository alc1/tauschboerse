import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

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
            <Router history={history}>
                <div>
                    <h1>Tauschbörse</h1>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/userarticles/1">Meine Artikel</Link></li>
                        <li><Link to="/marketplace">Marktplatz</Link></li>
                        <li>Tauschgeschäfte
                            <ul>
                                <li><Link to="/exchanges/incoming">Eingehende Anfragen</Link></li>
                                <li><Link to="/exchanges/outgoing">Ausgehende Anfragen</Link></li>
                            </ul>
                        </li>
                    </ul>
                    <hr/>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/userarticles/:userId" component={UserArticlesPage}/>
                    <Route exact path="/marketplace" component={MarketplacePage}/>
                    <Route exact path="/exchanges/incoming" component={IncomingExchangesPage}/>
                    <Route exact path="/exchanges/outgoing" component={OutgoingExchangesPage}/>
                    <Route exact path="/article/:articleId" component={ArticleDetailPage}/>
                </div>
            </Router>
        );
    }
}

export default App;
