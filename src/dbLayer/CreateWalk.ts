import 'source-map-support/register'
import { dbOperationResult } from './dbOperationResult';
import { StartNewWalkRequest } from '../requests/StartNewWalkRequest'
import { v4 as uuidv4 } from 'uuid';
import { WalkItem } from '../models/WalkItem'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// enable xray tracing for the sdk
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();
const walkTrackerTable = process.env.WALKSTRACKER_TABLE

export const CreateWalk = async (newWalk: StartNewWalkRequest, userId: string): Promise<dbOperationResult> => {
    const item: WalkItem = {
        kind: newWalk.kind,
        startedOn: newWalk.startedOn,
        endOn: null,
        userId: userId,
        walkId: uuidv4()
      }
      const params = {
        TableName: walkTrackerTable,
        Item: item
      }
      const reply : dbOperationResult = {
        error : true
      }
      try {
        await docClient.put(params).promise();
       reply.error = false;
       reply.message= { walkId: item.walkId, kind: item.kind, startedOn: item.startedOn};
      } catch (error) {
        reply.message= error;
      }
      return reply;
}