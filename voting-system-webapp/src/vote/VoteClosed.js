import React from 'react';
import './VotePage.css';

const VoteClosed = (props) => (
    <div className="aafvs-vote">
        <h2
            className="aafvs-vote__title">
            {this.props.election.title}
        </h2>
        <div className="aafvs-vote__content">
            <p className="aafvs-vote__instructions">
                This voting session has ended.
            </p>
        </div>
    </div>
);

export default VoteClosed;
