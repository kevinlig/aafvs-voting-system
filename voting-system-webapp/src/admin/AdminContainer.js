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
            inFlight: false
        };
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
                {...this.props} />
        );
    }
}

export default connect(
    (state) => ({
        election: state.election
    }),
    (dispatch) => bindActionCreators(voteActions, dispatch)
)(AdminContainer);
