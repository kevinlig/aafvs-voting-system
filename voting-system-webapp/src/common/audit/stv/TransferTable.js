import React from 'react';

const TransferTable = (props) => {
    const rows = props.data.map((candidate, index) => (
        <tr
            key={index}>
            <td>
                {candidate.code}
            </td>
            <td>
                {candidate.value}
            </td>
        </tr>
    ));
    return (
        <table
            className="aafvs-audit__table">
            <thead>
                <tr>
                    <th>
                        Ballot Item
                    </th>
                    <th>
                        Transfer Ratio
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default TransferTable;
