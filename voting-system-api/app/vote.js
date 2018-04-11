const utils = require('./utils.js');

const writeBallot = (electionId, voterId, data) => {
    return utils.writeDynamo(electionId, `vote__${voterId}`, data);
}

const castVote = (electionId, data, callback) => {
    const voterId = utils.generateId();
    
    // get the voting session to see if it exists
    utils.readSessionData(electionId)
        .then((res) => {
            if (res.length > 0) {
                if (!res[0].data.open) {
                    return Promise.reject({
                        response: utils.error(400, {
                            status: 'error',
                            reason: 'Voting session has closed.'
                        })
                    });
                }

                return writeBallot(electionId, voterId, data.ballot);
            }
            else {
                return Promise.reject({
                    response: utils.error(404, {
                        status: 'error',
                        reason: 'No such voting session.'
                    })
                });
            }
        })
        .then((res) => {
            callback(null, utils.response({
                voterId,
                status: 'success'
            }));
        })
        .catch((err) => {
            if (err.response) {
                callback(null, err.response);
            }
            else {
                callback(err, null);
            }
        });
};

module.exports = castVote;
