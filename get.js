import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export const main = async (event, context, callback) => {
  const params = {
    TableName: 'events',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      eventId: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDbLib.call('get', params);
    if (result.Item) {
      callback(null, success(result.Item));
    } else {
      callback(null, failure({ status: false, error: 'Item not Found.' }));
    }
  } catch (e) {
    callback(null, failure({ status: false }));
  }
};
