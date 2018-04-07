import React from 'react';

import VoteBallot from './VoteBallot';

import './VotePage.css';

export default class VotePage extends React.Component {
    render() {
        const itemCount = this.props.election.count !== 1 ? `${this.props.election.count} winners` : '1 winner';
        return (
            <div className="aafvs-vote">
                <h2
                    className="aafvs-vote__title">
                    {this.props.election.title}
                </h2>
                <div className="aafvs-vote__content">
                    <p className="aafvs-vote__instructions">
                        Drag and drop the boxes into the order of your choice (with the topmost box as your first choice).
                    </p>
                    <p className="aafvs-vote__instructions">
                        {itemCount} will be selected using a preferential voting scheme. You should arrange <span className="aafvs-vote__instructions_underline">every</span> box to reflect your full set of choices.
                    </p>
                    <p className="aafvs-vote__instructions">
                        Click the Submit button to submit your vote.
                    </p>
                </div>
                <div className="aafvs-vote__ballot">
                    <VoteBallot
                        options={this.props.election.options}
                        id={this.props.election.id}
                        ballotOrder={this.props.ballotOrder}
                        moveItemToPos={this.props.moveItemToPos} />
                </div>
            </div>
        );
    }
}
