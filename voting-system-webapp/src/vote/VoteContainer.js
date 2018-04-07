import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import shuffle from 'lodash/shuffle';

import { actions as voteActions } from '../redux/actions/voteActions';

import AdminNotFound from '../admin/AdminNotFound';
import VotePage from './VotePage';

class VoteContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inFlight: false
        };

        this.moveItemToPos = this.moveItemToPos.bind(this);
    }
    componentDidMount() {
        this.loadElection(this.props.match.params.election);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.election !== this.props.match.params.election) {
            this.loadElection(this.props.match.params.election);
        }
    }

    loadElection(id) {
        this.setState({
            inFlight: true
        });

        Axios.request({
            url: `/election/${id}`,
            method: 'get'
        })
        .then((res) => {
            this.parseElection(res.data);
            this.setState({
                inFlight: false
            });
        })
        .catch((err) => {
            if (err.response) {
                this.parseElection(err.response);
            }
            console.log(err);
            this.setState({
                inFlight: false
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

    render() {
        if (this.state.inFlight) {
            return 'Loading...';
        }
        if (!this.props.election.id) {
            return (
                <AdminNotFound />
            );
        }
        return (
            <VotePage
                {...this.props}
                moveItemToPos={this.moveItemToPos} />
        );
    }
}

export default connect(
    (state) => ({
        election: state.election,
        ballotOrder: state.ballotOrder
    }),
    (dispatch) => bindActionCreators(voteActions, dispatch)
)(VoteContainer);
