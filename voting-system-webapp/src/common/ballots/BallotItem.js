import React from 'react';

const BallotItem = (props) => {
    const hideClass = props.isRVH ? '' : 'aafvs-ballots__paragraph_hide';
    const items = props.ranks.map((item) => (
        <li
            className="aafvs-ballots__selected-list-item"
            key={item.code}>
            <b><i>{item.code}:</i></b>&nbsp;&nbsp;{item.value}
        </li>
    ));

    return (
        <div className="aafvs-ballots__ballot">
            <h4
                className="aafvs-ballots__subtitle">
                Voter {props.voterId}
            </h4>
            <p className={`aafvs-ballots__paragraph ${hideClass}`}>
                This ballot was chosen as the RVH ballot for use in breaking any ties that may have occurred.
            </p>
            <ol
                className="aafvs-ballots__selected-list">
                {items}
            </ol>
        </div>
    );
};

export default BallotItem;
