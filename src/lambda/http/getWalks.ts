import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils'
import { getWalks } from '../../businessLogic/walkTracker';
const logger = createLogger('getWalks');
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const result  = await getWalks(userId, logger);
  return result;
}
