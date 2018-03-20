import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export const main = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'events',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      eventId: event.pathParameters.id,
    },
    UpdateExpression: 'SET content = :content, images = :images',
    ExpressionAttributeValues: {
      ':images': data.images ? data.images : null,
      ':content': data.content ? data.content : null,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDbLib.call('update', params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
};
