import React from 'react';

import './ContentContainer.css';

export default function ContentContainer(props) {
    return (
        <div className="content-container">
            {props.children}
        </div>
    );
}
