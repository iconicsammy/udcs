'use strict';

import { CustomAuthorizerEvent } from "aws-lambda";

export default function getToken(event: CustomAuthorizerEvent) {
  if (event.type !== 'TOKEN') {
    throw new Error('Authorizer must be of type "TOKEN"');
  }

  const { authorizationToken: bearer } = event;
  if (!bearer) {
    throw new Error(
      'Authorization header with "Bearer TOKEN" must be provided'
    );
  }

  const tokenInfo = bearer.split(' ');

  //const [token] = bearer.match(/^Bearer (.*)$/) || [];
  if (tokenInfo.length !== 2 || tokenInfo[1] === '') {
    throw new Error('Invalid bearer token');
  }

  return tokenInfo[1];
};