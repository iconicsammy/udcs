import { StartNewWalkRequest } from '../requests/StartNewWalkRequest'
import { FinishWalkRequest } from '../requests/FinishWalkRequest'
import { dbOperationResult } from '../dbLayer/dbOperationResult';
import { FinishWalk } from '../dbLayer/FinishWalk'
import { CreateWalk } from '../dbLayer/CreateWalk';
import { DeleteWalk } from '../dbLayer/DeleteWalk'
import { GetWalks } from '../dbLayer/GetWalks';

const response = (responseBody) =>{
    return {
        statusCode: responseBody.error ? 400: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(responseBody)
      }
}

export const createNewWalk = async (newWalk: StartNewWalkRequest, userId: string, logger) => {
  //store result of db operation
  const result : dbOperationResult = await CreateWalk(newWalk, userId);
  if (result.error){
    // we have found an error
    logger.error('Unable to create walk ', {errorCreatingWalk: result.message});
  }else {
    // it was a scucess
    logger.error('new walk created ');
  }
  
  const responseBody = {
      error: result.error,
      item: result.message
  }
   return response(responseBody);
}


export const finishWalk = async(walkId : string, userId: string, finishWalkRequest: FinishWalkRequest , logger) => {
 
    const result: dbOperationResult = await FinishWalk(
      walkId,
      userId,
      finishWalkRequest
    )
    const responseBody = {
        error: result.error,
        message: result.error ? result.message : 'updated succesfully'
    }
    if (result.error) {
      logger.error('Finish walk ', {errorUpdatingWalk: result.message});
    } else {
      logger.info('finish walk')
    }
  
    return response(responseBody)
}

export const deleteExistingWalk = async(walkId: string, userId: string, logger) => {
    const result: dbOperationResult = await DeleteWalk(
        walkId,
        userId
      )
      const responseBody = {
          error: result.error,
          message: result.error ? result.message : 'deleted succesfully'
      }
      if (result.error) {
        logger.error('Delete walk ', {errorDeletingWalk: result.message});
      } else {
        logger.info('delete walk')
      }
    
      return response(responseBody)
}


export const getWalks = async(userId: string, logger) => {
    const result: dbOperationResult = await GetWalks(
        userId
      )
      const responseBody = {
          error: result.error
      }
      if (result.error){
        responseBody['errorMessage'] = result.message
        logger.error('Get walks ', {errorGettingListofWalks: result.message});
      }else {
        responseBody['items'] = result.message
        logger.info('get my walks')
      }    
      return response(responseBody)
}