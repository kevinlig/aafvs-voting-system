import React from 'react';

import VoteTable from './VoteTable';

const EliminateEvent = (props) => {
    const votes = Object.keys(props.counts).map((key) => ({
        code: props.codes[parseInt(key, 10)],
        value: props.counts[key],
        original: key
    })).sort((a, b) => b.value - a.value);

    const showRVH = props.usedRVH ? '' : 'aafvs-audit__hide';

    return (
        <div>
            <p className="aafvs-audit__paragraph">
                No ballot items received enough first-preference votes to meet or exceed the win quota. As a result, the ballot item with the lowest non-zero first-preference votes was eliminated from the available ballot options.
            </p>
            <VoteTable
                data={votes}
                quota={props.quota}
                losses={props.eliminated}
                highlightLosses />
            <div className={showRVH}>
                <p className="aafvs-audit__paragraph">
                    Multiple items were tied for receiving the lowest vote, so Random Voter Hierarchy (RVH) was used to break the tie. The lowest ranked item on the RVH ballot out of the tied items was the one that was eliminated.
                </p>
            </div>
            <p className="aafvs-audit__paragraph">
                All votes for eliminated items are transferred to the previous higher ranked/more preferred item on each voter's ballot at a 1:1 ratio, unless the eliminated item was ranked first-preference. If the eliminated item was ranked first-preference, its votes are transferred to the next (less) preferred item (still at a 1:1 ratio). Additionally, if the eliminated item was ranked last/least preferred, it is simply removed and its votes are not transferred.
            </p>
        </div>
    );
};

export default EliminateEvent;
