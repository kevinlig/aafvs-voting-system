const utils = require('./utils.js');
const runSTV = require('./count/stv.js');
const runSchulze = require('./count/schulze.js');

const updateSession = (id, data) => {
    return utils.writeDynamo(
        id,
        'ballot',
        data
    )
}

const getAllVotes = (id) => {
    return utils.readBallots(id);
}

const closeSessionAPI = (electionId, requestData, callback) => {
    // validate the body election ID matches the route election ID
    if (electionId !== requestData.id) {
        const badRequest = utils.error(400, {
            status: 'error',
            reason: 'Invalid request'
        });
        callback(null, badRequest);
        return;
    }

    // get the voting session to see if it exists
    let candidates = [];
    let winCount = 0;
    let response = {};
    let sessionData = {};
    utils.readSessionData(electionId)
        .then((res) => {
            if (res.length > 0) {
                if (!res[0].data.open) {
                    return Promise.reject({
                        response: utils.error(400, {
                            status: 'error',
                            reason: 'Voting session is already closed.'
                        })
                    });
                }

                candidates = res[0].data.options;
                winCount = res[0].data.count;
                sessionData = res[0].data;
                return getAllVotes(electionId);
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
        .then((rawBallots) => {
            // format the ballots for counting
            const ballots = rawBallots.reduce((parsed, ballot) => {
                const voterId = ballot.rowType.substring(ballot.rowType.indexOf('__') + 2);
                return Object.assign({}, parsed, {
                    [voterId]: ballot.data
                });
            }, {});

            // format the candidates as indices for counting
            const candidateIndices = candidates.map((candidate, index) => index);

            // perform the STV vote count
            const stv = runSTV(candidateIndices, ballots, winCount);
            
            // perform the Schulze vote count
            const schulze = runSchulze(candidateIndices, ballots, winCount);

            // use Schulze if possible, but switch to STV if more than 4 ties or insufficient results
            let method = 'schulze';
            let results = schulze;
            if (schulze.winners.length < winCount || schulze.ties > 4) {
                method = 'stv';
                results = stv;
            }

            response = {
                method: method,
                results: results,
                ballots: ballots,
            };

            // update the database with the result and close the session
            return updateSession(electionId, Object.assign({}, sessionData, {
                open: false,
                results: response
            }));
        })
        .then(() => {
            callback(null, utils.response(response));
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

module.exports = closeSessionAPI;
