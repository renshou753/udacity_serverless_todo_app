import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { getTodosPerUser } from '../../logicLayer/todo'
import { createLogger } from '../../utils/logger'
import 'source-map-support/register'


const logger = createLogger('Todo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  console.log('Processing event: ', event)
  logger.info("processing event ", event)

  
  const items = await getTodosPerUser(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}



