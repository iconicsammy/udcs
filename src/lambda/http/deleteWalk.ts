import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteWalk')
import { getUserId } from '../utils'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { deleteExistingWalk } from "../../businessLogic/walkTracker";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const walkId = event.pathParameters.walkId
  const userId = getUserId(event)
  const result = await deleteExistingWalk(walkId, userId, logger)
 return result;
}
