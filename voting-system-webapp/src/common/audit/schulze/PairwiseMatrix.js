import React from 'react';

const PairwiseMatrix = (props) => {
    const pairwiseHeaders = props.options.map((option) => (
        <th
            key={option}>
            x > {option}
        </th>
    ));

    const rows = props.options.map((candidateLetter, candidate) => {
            const rowHeader = (
                <th>
                    {candidateLetter} > x
                </th>
            );

            const rowCells = props.options.map((opponentLetter, opponent) => {
                // find the matchup in the pairwise audit
                const pair = props.data[`${candidate}>${opponent}`];
                if (!pair) {
                    const emptyValue = candidate === opponent ? '--' : '';
                    return (
                        <td
                            key={opponent}>
                            {emptyValue}
                        </td>
                    )
                }
                let winClass = '';
                if (props.highlightWins) {
                    winClass = pair.win ? 'aafvs-audit__win' : 'aafvs-audit__lose';
                }

                return (
                    <td
                        className={winClass}
                        key={opponent}>
                        {pair[props.valueKey]}
                    </td>
                );
            });

            return (
                <tr
                    key={candidate}>
                    {rowHeader}
                    {rowCells}
                </tr>
            );
        });

    return (
        <table
            className="aafvs-audit__pairwise">
            <thead>
                <tr>
                    <td />
                    {pairwiseHeaders}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default PairwiseMatrix;
