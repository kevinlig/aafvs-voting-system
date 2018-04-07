import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';

import { actions as voteActions } from '../redux/actions/voteActions';

import CreatePage from './CreatePage';

export class CreateContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inFlight: false
        };

        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(submission) {
        this.setState({
            inFlight: true
        }, () => {
            Axios.request({
                url: '/election/create',
                method: 'post',
                data: submission
            })
            .then((res) => {
                this.startElection(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        });
    }

    startElection(data) {
        window.location.hash = `/admin/${data.id}`;
    }

    render() {
        return (
            <CreatePage
                {...this.props}
                inFlight={this.state.inFlight}
                submitForm={this.submitForm} />
        );
    }
}

export default connect(
    (state) => ({
        election: state.election
    }),
    (dispatch) => bindActionCreators(voteActions, dispatch)
)(CreateContainer);
