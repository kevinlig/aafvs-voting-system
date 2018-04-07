export const types = {
    setElection: 'VOTE_SET_ELECTION',
    setBallotOrder: 'VOTE_SET_BALLOT_ORDER'
};

export const actions = {
    setElection(data) {
        return {
            type: types.setElection,
            election: {
                id: data.id,
                active: data.open,
                title: data.title,
                count: Number(data.count),
                options: data.options
            }
        };
    },
    setBallotOrder(order) {
        return {
            type: types.setBallotOrder,
            order: order
        };
    }
};
