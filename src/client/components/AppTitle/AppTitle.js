import React from 'react';
import PropTypes from 'prop-types';

import './AppTitle.css';

export default class AppTitle extends React.Component {

    static propTypes = {
        subtitle: PropTypes.string
    };

    getTitleToRender = () => {
        const { subtitle } = this.props;
        if (subtitle) {
            return (
                <div>
                    <div className="title__main">Tauschbörse</div>
                    <div className="title__sub">{subtitle}</div>
                </div>
            );
        }
        else {
            return <div>Tauschbörse</div>;
        }
    };

    render() {
        return this.getTitleToRender();
    }
}
