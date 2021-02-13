import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { createLogger } from '../../utils/logger';
const logger = createLogger('startNewWalk');
import { getUserId } from '../utils'
import { StartNewWalkRequest } from '../../requests/StartNewWalkRequest'
import { createNewWalk } from "../../businessLogic/walkTracker";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newWalk: StartNewWalkRequest = JSON.parse(event.body)
  const userId = getUserId(event);
  const result = await createNewWalk(newWalk, userId, logger);
  return result;
}
