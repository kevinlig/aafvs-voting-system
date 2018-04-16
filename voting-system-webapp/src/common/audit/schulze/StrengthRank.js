import React from 'react';

const StrengthRank = (props) => {
    const rows = props.data.map((rank) => {
        return (
            <tr
                key={rank.candidate}>
                <td>
                    {props.codes[parseInt(rank.candidate, 10)]}
                </td>
                <td>
                    {rank.value}
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
                        Total Strength
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
};

export default StrengthRank;
