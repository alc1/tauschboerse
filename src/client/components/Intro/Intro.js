import React from 'react';
import PropTypes from 'prop-types';

import IntroAnimation from '../IntroAnimation/IntroAnimation';
import IntroActions from '../../containers/IntroActions';

import './Intro.css';

export default class Intro extends React.Component {

    static propTypes = {
        muiTheme: PropTypes.shape({
            fontFamily: PropTypes.string.isRequired
        }).isRequired
    };

    render() {
        const { fontFamily } = this.props.muiTheme;
        return (
            <div className="intro">
                <h1 className="intro__title" style={{ fontFamily: fontFamily }}>Willkommen bei der Tauschbörse!</h1>
                <IntroAnimation/>
                <IntroActions/>
            </div>
        );
    }
}
