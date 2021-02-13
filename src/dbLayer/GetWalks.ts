import 'source-map-support/register'
import { dbOperationResult } from './dbOperationResult';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// enable xray tracing for the sdk
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();
const walkTrackerTable = process.env.WALKSTRACKER_TABLE

export const GetWalks = async (userId: string): Promise<dbOperationResult> => {
      const reply : dbOperationResult = {
        error : true
      }
      try {
        const result = await docClient.query({
          TableName: walkTrackerTable,
          IndexName: process.env.USER_ID_INDEX,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        })
        .promise()
       reply.error = false;
       reply.message= result.Items;
      } catch (error) {
        reply.message= error;
      }
  
      return reply;
}