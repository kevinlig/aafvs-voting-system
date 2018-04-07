import { types as VoteActions } from '../actions/voteActions';

export const initialState = {
    election: {
        id: '',
        active: false,
        title: '',
        count: 0,
        options: []
    },
    ballotOrder: []
};


export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case VoteActions.setElection:
            return Object.assign({}, state, {
                election: action.election
            });
        case VoteActions.setBallotOrder:
            return Object.assign({}, state, {
                ballotOrder: action.order
            });
        default:
            return state;
    }
}