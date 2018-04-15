import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';

import { actions as voteActions } from '../redux/actions/voteActions';

import AdminPage from './AdminPage';
import AdminNotFound from './AdminNotFound';

export class AdminContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inFlight: false,
            closeInFlight: false
        };

        this.closeElection = this.closeElection.bind(this);
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

    closeElection(id) {
        this.setState({
            closeInFlight: true
        });

        Axios.request({
            url: `/election/${id}/close`,
            method: 'post',
            data: {
                id: id
            }
        })
        .then((res) => {
            this.props.setElectionResults(res.data);
            this.setState({
                closeInFlight: false
            });
        })
        .catch((err) => {
            if (err.response) {
                this.parseElection(err.response);
            }
            console.log(err);
            this.setState({
                closeInFlight: false
            });
        });
    }

    parseElection(data) {
        this.props.setElection(data);
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
            <AdminPage
                {...this.props}
                closeElection={this.closeElection}
                closeInFlight={this.state.closeInFlight} />
        );
    }
}

export default connect(
    (state) => ({
        election: state.election
    }),
    (dispatch) => bindActionCreators(voteActions, dispatch)
)(AdminContainer);
