import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import 'source-map-support/register';
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import getToken from './getToken';
import verifyToken from './verifyToken';

const ssm = new AWS.SSM();
const auth0IdClientPromise = ssm
  .getParameter({
    Name: 'auth0_client_id',
    WithDecryption: false
  })
  .promise();

const logger = createLogger('auth')
const jwksUrl = 'https://dev-e8sf6q9b.us.auth0.com/.well-known/jwks.json'
const issuer = process.env.TOKEN_ISSUER;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const audience =   (await (auth0IdClientPromise)).Parameter.Value;
    const token = getToken(event);
    const jwtToken: JwtPayload = await verifyToken(token, issuer, audience) as JwtPayload;

    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })
    logger.error('User not authorized token', { error: event.authorizationToken })
    logger.error('User not authorized event',  event )
    throw new Error('Unauthorized');
  }
}
