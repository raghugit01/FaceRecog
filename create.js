import uuid from "uuid";
import AWS from "aws-sdk";

AWS.config.update({ region: "eu-west-1"});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
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

  dynamoDb.put(params, (error, data) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    if(error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ status: false })
      };
      callback(null, response);
      return;
    }

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
}