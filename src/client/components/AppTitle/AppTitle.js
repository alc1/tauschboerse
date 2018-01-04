import React from 'react';
import PropTypes from 'prop-types';

import './AppTitle.css';

export default class AppTitle extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
        subtitle: PropTypes.string,
    };

    goToHome = () => {
        this.props.history.push('/');
    };

    getTitleToRender = () => {
        const { subtitle } = this.props;
        if (subtitle) {
            return (
                <div className="app-title">
                    <span className="app-title__main app-title__main--clickable" onClick={this.goToHome}>Tauschbörse</span>
                    <span className="app-title__sub">{subtitle}</span>
                </div>
            );
        }
        else {
            return <span className="app-title__main--clickable" onClick={this.goToHome}>Tauschbörse</span>;
        }
    };

    render() {
        return this.getTitleToRender();
    }
}
