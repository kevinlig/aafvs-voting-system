import React from 'react';

const VoteTable = (props) => {
    const rows = props.data.map((candidate, index) => {
        let winClass = '';
        if (props.highlightWins && candidate.value >= props.quota) {
            winClass = 'aafvs-audit__win';
        }
        else if (props.highlightLosses && props.losses.indexOf(candidate.original) > -1) {
            winClass = 'aafvs-audit__lose';
        }

        return (
            <tr
                key={index}>
                <td className={winClass}>
                    {candidate.code}
                </td>
                <td className={winClass}>
                    {candidate.value}
                </td>
            </tr>
        );
    });
    return (
        <table
            className="aafvs-audit__table">
            <thead>
                <tr>
                    <th>
                        Ballot Item
                    </th>
                    <th>
                        Votes
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default VoteTable;
