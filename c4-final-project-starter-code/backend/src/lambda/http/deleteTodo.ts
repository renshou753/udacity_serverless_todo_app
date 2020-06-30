import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../logicLayer/todo'
import 'source-map-support/register'

const logger = createLogger('Todo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  await deleteTodo(userId, todoId)
  

  // TODO: Remove a TODO item by id
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      
    })
  }
}

