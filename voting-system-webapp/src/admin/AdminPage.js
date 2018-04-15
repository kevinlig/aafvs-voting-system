import React from 'react';
import Share from './Share';

import Results from '../common/Results';

import './AdminPage.css';

export default class AdminPage extends React.Component {
    render() {
        const openState = this.props.election.active ? 'open' : 'closed';
        let share = null;
        let results = null;
        if (this.props.election.active) {
            share = (
                <Share
                    election={this.props.election}
                    closeElection={this.props.closeElection}
                    closeInFlight={this.props.closeInFlight} />
            );
        }
        else {
            results = (
                <Results
                    {...this.props.election.results}
                    id={this.props.election.id}
                    count={this.props.election.count}
                    options={this.props.election.options} />
            );
        }

        return (
            <div className="aafvs-admin">
                <h2
                    className="aafvs-admin__title">
                    Manage Voting Session: {this.props.election.title}
                </h2>
                <div className="aafvs-admin__content">
                    <p>
                        This voting session is currently <b>{openState}</b>.
                    </p>
                    {share}
                    {results}
                </div>
            </div>
        );
    }
}
