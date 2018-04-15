import React from 'react';

import Schulze from './Schulze';
import STV from './STV';

import './Audit.css';

const methodNames = {
    schulze: 'Condorcet/Schulze',
    stv: 'Single Transferable Vote (STV)'
}

export default class Audit extends React.Component {
    methodDescription() {
        if (this.props.method === 'schulze') {
            if (this.props.results.ties === 0) {
                return 'This system defaults to the Schulze method of Condorcet vote counting whenever possible.';
            }
            else {
                return 'This system defaults to the Schulze method of Condorcet vote counting whenever possible. Additionally, some ties occurred that were resolved using the Random Voter Hierarchy methodology.';
            }
        }
        else {
            return 'This system defaults to the Schulze method of Condorcet vote counting whenever possible. However, either a Condorcet paradox occurred that could not be resolved or the system could not determine the number of Condorcet winners that the vote required. As a result, the system used Single Transferable Vote to count the votes as a fallback.';
        }
    }

    render() {
        const methodName = methodNames[this.props.method] || '';

        let breakdown = null;
        if (this.props.method === 'schulze') {
            breakdown = (
                <Schulze
                    {...this.props} />
            );
        }
        else if (this.props.method === 'stv') {
            breakdown = (
                <STV
                    {...this.props} />
            );
        }

        return (
            <div className="aafvs-audit">
                <h3
                    className="aafvs-audit__title">
                    Audit
                </h3>
                <div className="aafvs-audit__method">
                    <b>Methodology:</b> {methodName}
                    <p className="aafvs-audit__paragraph">
                        {this.methodDescription()}
                    </p>
                </div>
                {breakdown}
            </div>
        );
    }
}