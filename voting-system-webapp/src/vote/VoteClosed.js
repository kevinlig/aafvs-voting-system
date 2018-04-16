import React from 'react';

import Results from '../common/Results';

import './VotePage.css';

const VoteClosed = (props) => (
    <div className="aafvs-vote">
        <h2
            className="aafvs-vote__title">
            {props.title}
        </h2>
        <div className="aafvs-vote__content">
            <p className="aafvs-vote__instructions">
                This voting session is now closed, but the results are shown below.
            </p>
            <Results
                {...props.election.results}
                id={props.election.id}
                count={props.election.count}
                options={props.election.options} />
        </div>
    </div>
);

export default VoteClosed;
