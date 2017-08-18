import React from 'react';
import { Link } from 'react-router-dom';

class NavigationComponent extends React.Component {
    render() {
        return (
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/userarticles/ph63KF1MYC8IZxfl">Meine Artikel</Link></li>
                <li><Link to="/marketplace">Marktplatz</Link></li>
                <li>Tauschgeschäfte
                    <ul>
                        <li><Link to="/exchanges/incoming">Eingehende Anfragen</Link></li>
                        <li><Link to="/exchanges/outgoing">Ausgehende Anfragen</Link></li>
                    </ul>
                </li>
            </ul>
        );
    }
}

export default NavigationComponent;
