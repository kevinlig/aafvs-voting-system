import React from 'react';

import VoteTable from './VoteTable';
import TransferTable from './TransferTable';

const WinEvent = (props) => {
    const winList = props.winners.map((winner) => props.codes[parseInt(winner, 10)]).join(', ');

    const votes = Object.keys(props.counts).map((key) => ({
        code: props.codes[parseInt(key, 10)],
        value: props.counts[key],
        original: key
    })).sort((a, b) => b.value - a.value);

    const transfer = Object.keys(props.transfer).reduce((transfers, key) => {
        const transferItem = {
            code: props.codes[parseInt(key, 10)],
            value: props.transfer[key],
            original: key
        };

        if (props.transfer[key] === 0) {
            // do nothing, no transfer
            return transfers;
        }
        else {
            transfers.push(transferItem);
            return transfers;
        }
    }, []).sort((a, b) => b.value - a.value);

    const showNext = props.isLast ? 'aafvs-audit__hide' : '';
    const showTransfer = transfer.length > 0 ? '' : 'aafvs-audit__hide';

    return (
        <div>
            <p className="aafvs-audit__paragraph">
                The following ballot items received enough first-preference votes to meet or exceed the win quota: {winList}.
            </p>
            <VoteTable
                data={votes}
                quota={props.quota}
                losses={[]}
                highlightWins />
            <div className={showNext}>
                <p className="aafvs-audit__paragraph">
                    Winning ballot items are removed from the available options in the next round and replaced with the next preferred item from each voter's ballot.
                </p>
                <div className={showTransfer}>
                    <p className="aafvs-audit__paragraph">
                        Winning ballot items are removed from the available options in the next round and replaced with the next preferred item from each voter's ballot. For items that received more votes than the minimum win quota, their votes are reallocated to each voter's next preference based on the following table:
                    </p>
                    <TransferTable
                        data={transfer} />
                    <br />
                </div>
            </div>
        </div>
    );
};

export default WinEvent;
