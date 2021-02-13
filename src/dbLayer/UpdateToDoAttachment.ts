import 'source-map-support/register'
import { dbOperationResult } from './dbOperationResult';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// enable xray tracing for the sdk
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();
const walkTrackerTable = process.env.WALKSTRACKER_TABLE

export const UpdateToDoAttachment = async (todoId: string, url: string): Promise<dbOperationResult> => {
      const reply : dbOperationResult = {
        error : true
      }
      const params = {
        TableName: walkTrackerTable,
        Key: {
          todoId
        },
        UpdateExpression: "set attachmentUrl=:attachmentUrl", // name is reserved keyword
        ExpressionAttributeValues:{
            ":attachmentUrl":url
        }
      }
      try {
       await docClient.update(params).promise()
       reply.error = false;
      } catch (error) {
        reply.message= error;
      }
      return reply;
}