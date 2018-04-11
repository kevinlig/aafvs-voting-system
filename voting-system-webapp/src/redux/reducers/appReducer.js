import { types as VoteActions } from '../actions/voteActions';

export const initialState = {
    election: {
        id: '',
        active: false,
        title: '',
        count: 0,
        options: []
    },
    ballotOrder: [],
    voterStatus: {
        submitted: false,
        id: ''
    }
};


export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case VoteActions.setElection:
            return Object.assign({}, state, {
                election: action.election,
                voterStatus: { // also reset the voter status
                    submitted: false,
                    id: ''
                }
            });
        case VoteActions.setBallotOrder:
            return Object.assign({}, state, {
                ballotOrder: action.order
            });
        case VoteActions.setVoterStatus:
            return Object.assign({}, state, {
                voterStatus: {
                    submitted: true,
                    id: action.id
                }
            });
        default:
            return state;
    }
}