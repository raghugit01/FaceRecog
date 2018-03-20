import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {success, failure} from "./libs/response-lib";


export const main = async(event, context, callback) => {
//  Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "events",
  //  'Item' contains the attributes of the item to be created
  //  - 'userId': user identities are federated through the
  //              Cognito Identity Pool, we will use the identity id
  //              as the user id of the authenticated user
  //  - eventId
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      eventId: uuid.v1(),
      content: data.content,
      images: data.images,
      createdAt: new Date().getTime()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch(e) {
    callback(null, failure({status: false}));
  }
}