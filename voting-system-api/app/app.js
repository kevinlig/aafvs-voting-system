const createSession = require('./create.js');
const showSession = require('./show.js');
const castVote = require('./vote.js');

const app = (request, callback) => {
    switch (request.route) {
        case '/election/create':
            createSession(request.body, callback);
            break;
        case '/election/{electionId}':
            showSession(request.params.electionId, callback);
            break;
        case '/election/{electionId}/vote':
            castVote(request.params.electionId, request.body, callback);
            break;
        default:
            callback(
                null,
                {
                    statusCode: 404,
                    body: 'Not found',
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                }
            );
            return;
    }
};

module.exports = app;