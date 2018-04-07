const utils = require('./utils.js');

const showSession = (id, callback) => {
    
    // write the item to the table
    utils.readSessionData(id)
        .then((data) => {
            if (data.length > 0) {
                callback(
                    null,
                    utils.response(data[0].data)
                );
            }
            else {
                // no result
                callback(
                    null,
                    utils.notFound()
                );
            }
        })
        .catch((err) => {
            callback(err, null);
        });
};

module.exports = showSession;
