//import { decode } from 'jsonwebtoken'
import { verify, decode } from 'jsonwebtoken'
const jwksRSA = require('jwks-rsa');
const util = require('util');
import { Jwt } from '../../auth/Jwt'

const { JWKS_URI } = process.env;

const jwksClient = jwksRSA({  cache: true,  rateLimit: true,  jwksUri: JWKS_URI});
const getSigningKey = util.promisify(jwksClient.getSigningKey);

export default async function verifyToken(
  token : string,
  issuer: string,
  audience: string
) {
  const decoded: Jwt = decode(token, { json: true, complete: true })  as Jwt;

  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid JWT');
  }

  // Step 2
  const { publicKey, rsaPublicKey } = await getSigningKey(decoded.header.kid);
  const signingKey = publicKey || rsaPublicKey;

  // Step 3
  return verify(token, signingKey, {
    issuer,
    audience
  });
};