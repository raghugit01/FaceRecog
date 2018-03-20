import * as dynamoDbLib from "./libs/dynamodb-lib";
import {success, failure} from "./libs/response-lib";

export const main = async (event, context, callback) {
  const params = {
    TableName: "events",

  }
}