'use strict';

const app = require('./app/app.js');

module.exports.app = (event, context, callback) => {
    const request = {
        route: event.resource,
        params: Object.assign({}, event.pathParameters),
        method: event.httpMethod,
        body: {}
    };
    if (event.body) {
        request.body = JSON.parse(event.body);
    }
    
    app(request, callback);
}
