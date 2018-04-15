import React from 'react';
import { alphabet } from '../audit/alphabet';

import BallotItem from './BallotItem';

import './Ballots.css';

export default class Ballots extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            codes: [],
            ballots: []
        };
    }

    componentDidMount() {
        this.prepareData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.prepareData();
        }
    }

    prepareCodes() {
        return this.props.options.map((option, index) => (
            alphabet[index % 26]
        ));
    }

    prepareBallots(codes) {
        const parsed = Object.keys(this.props.ballots).map((voter) => {
            const data = this.props.ballots[voter];
            const ballot = {
                voterId: voter.substring(voter.length - 5),
                isRVH: this.props.results.rvh.id === voter,
                ranks: data.map((index) => ({
                    code: codes[index],
                    value: this.props.options[index]
                }))
            };

            return ballot;
        });

        // return in alphabetical order by voter ID
        return parsed.sort((a, b) => {
            if (a.voterId < b.voterId) {
                return -1;
            }
            else if (a.voterId > b.voterId) {
                return 1;
            }
            return 0;
        });
    }

    prepareData() {
        const codes = this.prepareCodes();
        this.setState({
            codes: codes,
            ballots: this.prepareBallots(codes)
        });
    }

    render() {
        const ballots = this.state.ballots.map((ballot) => (
            <BallotItem
                key={ballot.voterId}
                {...ballot} />
        ));

        return (
            <div className="aafvs-ballots">
                 <h3
                    className="aafvs-ballots__title">
                    Ballots
                </h3>
                <p className="aafvs-ballots__paragraph">
                    The ballots that were received by the system are shown below.
                </p>
                <ul
                    className="aafvs-ballots__list">
                    {ballots}
                </ul>
            </div>
        );
    }
}