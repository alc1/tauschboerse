import React from 'react';

import './ContentContainer.css';

export default function ContentContainer(props) {
    return (
        <main className="content-container">
            {props.children}
        </main>
    );
}
