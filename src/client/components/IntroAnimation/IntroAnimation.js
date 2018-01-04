import React from 'react';

import Paper from 'material-ui/Paper';

import Swap from '../_svg/Swap';
import Camera from '../_svg/Camera';
import Flower from '../_svg/Flower';
import Bike from '../_svg/Bike';
import Toys from '../_svg/Toys';
import Watch from '../_svg/Watch';
import Tablet from '../_svg/Tablet';

import './IntroAnimation.css';

export default class IntroAnimation extends React.Component {
    render() {
        return (
            <div className="intro-animation">
                <div className="intro-animation__images-group">
                    <Camera className="intro-animation__small-image intro-animation__timer"/>
                    <Flower className="intro-animation__medium-image intro-animation__timer"/>
                    <Bike className="intro-animation__large-image intro-animation__timer"/>
                </div>
                <Paper className="intro-animation__swap-image-wrapper" zDepth={3} circle>
                    <Swap className="intro-animation__swap-image intro-animation__timer"/>
                </Paper>
                <div className="intro-animation__images-group">
                    <Toys className="intro-animation__large-image intro-animation__timer"/>
                    <Watch className="intro-animation__medium-image intro-animation__timer"/>
                    <Tablet className="intro-animation__small-image intro-animation__timer"/>
                </div>
            </div>
        );
    }
}
