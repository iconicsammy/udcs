import 'source-map-support/register'
import { dbOperationResult } from './dbOperationResult';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// enable xray tracing for the sdk
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();
import { FinishWalkRequest } from '../requests/FinishWalkRequest'
const walkTrackerTable = process.env.WALKSTRACKER_TABLE

export const FinishWalk = async (walkId: string, userId: string, finishWalk: FinishWalkRequest): Promise<dbOperationResult> => {
      const reply : dbOperationResult = {
        error : true
      }
      const params = {
        TableName: walkTrackerTable,
        Key: {
          walkId
        },
        UpdateExpression: "set endOn=:endOn", 
        ConditionExpression: "userId = :user",
        ExpressionAttributeValues:{
            ":endOn": finishWalk.endOn,
            ":user": userId
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