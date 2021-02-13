import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger';
const logger = createLogger('generateUploadURL');
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { uploadImage } from "../../businessLogic/uploadImage";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

let statusCode = 400;
let reply = await uploadImage(todoId, logger)
if (!reply.error){
  statusCode = 200
}

  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(reply)
  }


}
