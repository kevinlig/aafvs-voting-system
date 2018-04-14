const uuid = require('uuid/v4');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

if (process.env.IS_LOCAL) {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_PROFILE
    });
}

const doc = new AWS.DynamoDB.DocumentClient();

module.exports = {
    response(data) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(data)
        };
    },
    notFound() {
        return {
            statusCode: 404,
            body: 'Not found',
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            }
        }
    },
    error(status, message) {
        return {
            statusCode: status,
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            }
        }
    },
    generateId() {
        return uuid().replace(/-/g, '');
    },
    writeDynamo(session, rowType, data) {
        return new Promise((resolve, reject) => {
            doc.put({
                TableName: process.env.DYNAMO_TABLE,
                Item: {
                    session,
                    rowType,
                    data
                }
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    },
    readSessionData(session) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: process.env.DYNAMO_TABLE,
                KeyConditions: {
                    session: {
                        ComparisonOperator: 'EQ',
                        AttributeValueList: [session]
                    },
                    rowType: {
                        ComparisonOperator: 'EQ',
                        AttributeValueList: ['ballot']
                    }
                }
            };
            doc.query(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.Items);
                }
            });
        });
    },
    readBallots(electionId) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: process.env.DYNAMO_TABLE,
                KeyConditions: {
                    session: {
                        ComparisonOperator: 'EQ',
                        AttributeValueList: [electionId]
                    },
                    rowType: {
                        ComparisonOperator: 'BEGINS_WITH',
                        AttributeValueList: ['vote__']
                    }
                }
            };
            doc.query(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.Items);
                }
            });
        });
    }
};
