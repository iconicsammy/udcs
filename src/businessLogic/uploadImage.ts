import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { UpdateToDoAttachment } from '../dbLayer/UpdateToDoAttachment';
import { dbOperationResult } from '../dbLayer/dbOperationResult';
import * as AWSXRay from 'aws-xray-sdk'
// enable xray tracing for the sdk
const XAWS = AWSXRay.captureAWS(AWS)
const bucketName = process.env.GALLERY_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const uploadImage = async (todoId: string, logger) => {

  const uploadParms = {
    Bucket: bucketName,
    Key: `${todoId}.png`,
    Expires: urlExpiration
  }
  const responseBody = {
    error: true
  }
  try {
    const uploadURL = s3.getSignedUrl('putObject', uploadParms);
    //update the attachment url of the to do item now
    const result : dbOperationResult = await UpdateToDoAttachment(todoId, uploadURL.split('?')[0]); //just get the file name
    if (result.error){
      responseBody['warning'] = 'error updating the attachment url';
      logger.error('Unable to update attachmentURL of an item ', { errorAttachingURL: result.message});
      responseBody['warningDetail'] = result.message
    }
    responseBody.error = false;
    logger.info('Generated pre-signed URL')
    responseBody['uploadUrl'] = uploadURL;
  } catch (error) {
    logger.error(`error generating upload url`, {errorGeneratingSignedURL: error})
    responseBody['message']='error creating signed url'
  }
  return responseBody;
}