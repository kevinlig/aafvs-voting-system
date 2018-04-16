import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import shuffle from 'lodash/shuffle';

import { actions as voteActions } from '../redux/actions/voteActions';

import AdminNotFound from '../admin/AdminNotFound';
import VotePage from './VotePage';
import VoteClosed from './VoteClosed';

class VoteContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingElection: false,
            submittingVote: false
        };

        this.moveItemToPos = this.moveItemToPos.bind(this);
        this.castVote = this.castVote.bind(this);
    }
    componentDidMount() {
        this.loadElection(this.props.match.params.election);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.election.id !== this.props.match.params.election.id) {
            this.loadElection(this.props.match.params.election);
        }
    }

    loadElection(id) {
        this.setState({
            loadingElection: true
        });

        Axios.request({
            url: `/election/${id}`,
            method: 'get'
        })
        .then((res) => {
            this.parseElection(res.data);
            this.setState({
                loadingElection: false,
                voted: true
            });
        })
        .catch((err) => {
            if (err.response) {
                this.parseElection(err.response);
            }
            console.log(err);
            this.setState({
                loadingElection: false
            });
        });
    }

    parseElection(data) {
        this.props.setElection(data);
        this.generateOrder(data.options);
    }

    generateOrder(options) {
        const indices = [];
        for (const index in options) {
            indices.push(parseInt(index, 10));
        };

        this.props.setBallotOrder(shuffle(indices));
    }

    moveItemToPos(id, index) {
        const updatedOrder = Array.from(this.props.ballotOrder);
        updatedOrder.splice(updatedOrder.indexOf(id), 1);
        updatedOrder.splice(Math.min(index, updatedOrder.length), 0, id);

        this.props.setBallotOrder(updatedOrder);
    }

    castVote() {
        this.setState({
            submittingVote: true
        });

        Axios.request({
            url: `/election/${this.props.election.id}/vote`,
            method: 'post',
            data: {
                ballot: this.props.ballotOrder
            }
        })
        .then((res) => {
            this.setState({
                submittingVote: false
            }, () => {
                this.props.setVoterStatus(res.data.voterId);
            });
        })
        .catch((err) => {
            if (err.response) {

            }
            console.log(err);
            this.setState({
                submittingVote: false
            });
        })
    }

    render() {
        if (this.state.loadingElection) {
            return 'Loading...';
        }
        if (!this.props.election.id) {
            return (
                <AdminNotFound />
            );
        }
        else if (!this.props.election.active) {
            // voting is closed
            return (
                <VoteClosed
                    title={this.props.election.title}
                    election={this.props.election} />
            );
        }
        else if (this.props.voterStatus.submitted) {
            return `Voted! You are ${this.props.voterStatus.id.substring(this.props.voterStatus.id.length - 5)}`;
        }
        return (
            <VotePage
                {...this.props}
                moveItemToPos={this.moveItemToPos}
                castVote={this.castVote}
                inFlight={this.state.submittingVote} />
        );
    }
}

export default connect(
    (state) => ({
        election: state.election,
        ballotOrder: state.ballotOrder,
        voterStatus: state.voterStatus
    }),
    (dispatch) => bindActionCreators(voteActions, dispatch)
)(VoteContainer);
