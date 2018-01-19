import React from 'react';

import PageTitle from '../../containers/PageTitle';
import IntroActions from '../../containers/IntroActions';
import IntroAnimation from '../IntroAnimation/IntroAnimation';
import ContentContainer from '../ContentContainer/ContentContainer';

export default function Intro() {
    return (
        <ContentContainer>
            <PageTitle>Willkommen bei der Tauschbörse!</PageTitle>
            <IntroAnimation/>
            <IntroActions/>
        </ContentContainer>
    );
}
