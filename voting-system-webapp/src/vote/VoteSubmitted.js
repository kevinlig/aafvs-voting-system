import React from 'react';

import './VotePage.css';

const VoteSubmitted = (props) => (
    <div className="aafvs-vote">
        <h2
            className="aafvs-vote__title">
            {props.title}
        </h2>
        <div className="aafvs-vote__content">
            <p className="aafvs-vote__instructions">
                Your vote has been received. Your voter ID is <b>{props.voterId.substring(props.voterId.length - 5)}</b>.
            </p>
        </div>
    </div>
);

export default VoteSubmitted;
