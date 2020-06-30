import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { todoExists } from '../../logicLayer/todo'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../logicLayer/todo'
import 'source-map-support/register'

const logger = createLogger('Todo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)

  const todoId = event.pathParameters.todoId
  const validTodoId = await todoExists(userId, todoId)
  
  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }

  let url = await generateUploadUrl(userId, todoId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}



