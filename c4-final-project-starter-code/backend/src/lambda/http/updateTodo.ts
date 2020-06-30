import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../logicLayer/todo'
import { UpdateTodoRequest } from '../../requests/updateTodoRequest'
import 'source-map-support/register'

const logger = createLogger('Todo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  await updateTodo( userId, todoId, updatedTodo)

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

