const utils = require('./utils.js');

const createSession = (data, callback) => {
    const id = utils.generateId();
    const session = {
        id: id,
        title: data.title || '',
        count: data.count || 0,
        options: [],
        open: true
    };

    if (data.options && data.options.length > 0) {
        session.options = data.options;
    }

    // write the item to the table
    utils.writeDynamo(
        id,
        'ballot',
        session
    )
        .then((res) => {
            callback(
                null,
                utils.response(session)
            );
        })
        .catch((err) => {
            callback(err, null);
        });
};

module.exports = createSession;
