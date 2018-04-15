import React from 'react';

import Audit from './audit/Audit';

import './Results.css';

export default class Results extends React.Component {
    render() {
        const items = this.props.results.winners.map((winningIndex) => {
            const winningValue = this.props.options[parseInt(winningIndex, 10)];
            return (
                <li
                    className="aafvs-results__list-item"
                    key={winningIndex}>
                    {winningValue}
                </li>
            );
        });

        return (
            <div
                className="aafvs-results">
                <h3
                    className="aafvs-results__title">
                    Results
                </h3>
                <ol
                    className="aafvs-results__list">
                    {items}
                </ol>
                <Audit
                    {...this.props} />
            </div>
        );
    }
}