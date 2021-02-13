import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('finishWalk')
import { finishWalk } from '../../businessLogic/walkTracker';
import { FinishWalkRequest } from '../../requests/FinishWalkRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const walkId = event.pathParameters.walkId
  const updatedWalk: FinishWalkRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const result =  await finishWalk(
    walkId,
    userId,
    updatedWalk,
    logger
  )
  return result;
}
